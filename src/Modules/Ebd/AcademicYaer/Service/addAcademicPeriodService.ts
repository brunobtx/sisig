import { number } from "joi";
import prismaClient from "../../../../prisma";
import { BadRequestError } from "../../../../Common/Application/Errors/BadRequestError";
import { DateUtils } from "../../../../Common/Helper/dateUltilHelper"

interface AcademicPeriod {
  id_academy_year: number;
  name: string;
  dt_start: Date;
  dt_end: Date;
  id_person_create: number;
}

export class AddAcademicPeriodService {
  async execute(data: AcademicPeriod) {
    const { id_academy_year, name, dt_start, dt_end, id_person_create } = data;

    if (DateUtils.isDateEqual(dt_start, dt_end)) {
      throw new BadRequestError(
        "Data de início do Período não pode ser a mesma do final"
      );
    }
    if (DateUtils.isAfter(dt_start, dt_end)) {
      throw new BadRequestError(
        "Data de início do Período não pode ser maior que a final"
      );
    }
    
    const start = DateUtils.toDate(dt_start);
    const end = DateUtils.toDate(dt_end);

    const existingPeriod = await prismaClient.academicPeriod.findFirst({
      where: {
        id_academy_year,
        dt_start: { lte: start },
        dt_end: { gte: end },
      },
    });

    if (existingPeriod) {
      throw new BadRequestError(
        "Já existe um período acadêmico cadastrado que engloba essas datas."
      );
    }

    const academicPeriod = await prismaClient.academicPeriod.create({
      data: {
        id_academy_year,
        name,
        dt_start,
        dt_end,
        id_person_create,
      },
      select: {
        id_academy_year: true,
        name: true,
        dt_start: true,
        dt_end: true,
      },
    });

    return academicPeriod;
  }
}

