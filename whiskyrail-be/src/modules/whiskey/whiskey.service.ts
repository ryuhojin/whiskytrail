// src/whiskey/whiskey.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetWhiskiesDto } from './dto/get-whiskies.dto';
import { WhiskeyResponseDto } from './dto/whiskey-response.dto';

@Injectable()
export class WhiskeyService {
  constructor(private readonly prisma: PrismaService) {}

  async getWhiskies(filterDto: GetWhiskiesDto): Promise<WhiskeyResponseDto[]> {
    const {
      age,
      distilleryId,
      region,
      caskType,
      isLimitedEdition,
      isIndependentBottled,
    } = filterDto;
    const where: any = {};

    if (age !== undefined) {
      where.age = age;
    }

    if (distilleryId !== undefined) {
      where.distillery_id = distilleryId;
    }

    if (caskType) {
      where.cask_type = caskType;
    }

    if (isLimitedEdition !== undefined) {
      where.is_limited_edition = isLimitedEdition;
    }

    if (isIndependentBottled !== undefined) {
      where.is_independent_bottled = isIndependentBottled;
    }

    if (region) {
      where.distilleries = {
        location: { contains: region, mode: 'insensitive' },
      };
    }

    const whiskies = await this.prisma.whiskeys.findMany({
      where,
      include: {
        distilleries: true,
        independentbottlers: true,
        whiskeyimages: true,
        whiskeytags: {
          include: {
            tags: true,
          },
        },
      },
      orderBy: {
        release_date: 'desc',
      },
    });

    const result: WhiskeyResponseDto[] = whiskies.map((whiskey) => {
      return {
        whiskeyId: whiskey.whiskey_id,
        name: whiskey.name,
        age: whiskey.age ?? undefined,
        isIndependentBottled: whiskey.is_independent_bottled ?? undefined,
        isLimitedEdition: whiskey.is_limited_edition ?? undefined,
        caskType: whiskey.cask_type ?? undefined,
        price: whiskey.price ? Number(whiskey.price) : undefined,
        description: whiskey.description ?? undefined,
        releaseDate: whiskey.release_date ?? undefined,
        distillery: whiskey.distilleries
          ? {
              distilleryId: whiskey.distilleries.distillery_id,
              name: whiskey.distilleries.name,
              location: whiskey.distilleries.location ?? undefined,
              establishedYear: whiskey.distilleries.established_year ?? undefined,
              website: whiskey.distilleries.website ?? undefined,
            }
          : null,
        independentBottler: whiskey.independentbottlers
          ? {
              bottlerId: whiskey.independentbottlers.bottler_id,
              name: whiskey.independentbottlers.name,
              location: whiskey.independentbottlers.location ?? undefined,
              establishedYear: whiskey.independentbottlers.established_year ?? undefined,
              description: whiskey.independentbottlers.description ?? undefined,
            }
          : null,
        images: whiskey.whiskeyimages.map((img) => img.image_url),
        tags: whiskey.whiskeytags.map((wt) => ({
          tagId: wt.tag_id,
          name: wt.tags.name,
        })),
      };
    });

    return result;
  }
}
