import { SetMetadata } from "@nestjs/common";

export const role = (...role: string[]) =>  SetMetadata('role', role);
