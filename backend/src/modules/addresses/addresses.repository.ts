import { prisma } from "../../shared/database/prisma.js";
import type { CreateAddressDTO, UpdateAddressDTO } from "./addresses.dto.js";

export class AddressesRepository {
  async createAddress(userId: number, addressData: CreateAddressDTO) {
    return prisma.address.create({
      data: {
        userId,
        ...addressData,
      },
    });
  }

  async findAddressByUserId(userId: number) {
    return prisma.address.findUnique({
      where: {
        userId,
      },
    });
  }

  async updateAddressByUserId(userId: number, addressData: UpdateAddressDTO) {
    return prisma.address.update({
      where: {
        userId,
      },
      data: {
        ...addressData,
      },
    });
  }

  async deleteAddressByUserId(userId: number) {
    return prisma.address.delete({
      where: {
        userId,
      },
    });
  }
}
