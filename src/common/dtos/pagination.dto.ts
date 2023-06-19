import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"


export class PaginationDTO {

    @IsOptional()
    @IsPositive()
    @Type(() => Number ) //enable Impplicit conversions: true
    limit?: number

    @IsOptional()
    @Min(0)
    @Type(() => Number ) //enable Impplicit conversions: true
    offset? : number
}