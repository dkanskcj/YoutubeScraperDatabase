import { CreateVideoDTO } from "./create-video.dto";

export class PaginationDTO {
    items: CreateVideoDTO[];
    count: number;
}