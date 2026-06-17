import { AppError } from "../../shared/errors/AppError.js";
import { AddressesRepository } from "./addresses.repository.js";
import type { CreateAddressDTO, UpdateAddressDTO } from "./addresses.dto.js";

const addressesRepository = new AddressesRepository();

export class AddressesService {
  async create(userId: number, data: CreateAddressDTO) {
    if (typeof data.street !== "string") {
      throw new AppError("Rua com formato inválido", 400);
    }

    if (!data.street || !data.street.trim()) {
      throw new AppError("Rua é obrigatória", 400);
    }

    const street = data.street.trim();

    if (typeof data.number !== "string") {
      throw new AppError("Número com formato inválido", 400);
    }

    if (!data.number || !data.number.trim()) {
      throw new AppError("Número é obrigatório", 400);
    }

    const number = data.number.trim();

    if (typeof data.city !== "string") {
      throw new AppError("Cidade com formato inválido", 400);
    }

    if (!data.city || !data.city.trim()) {
      throw new AppError("Cidade é obrigatória", 400);
    }

    const city = data.city.trim();

    if (typeof data.state !== "string") {
      throw new AppError("Estado com formato inválido", 400);
    }

    if (!data.state || !data.state.trim()) {
      throw new AppError("Estado é obrigatório", 400);
    }

    const state = data.state.trim().toUpperCase();

    if (typeof data.zipCode !== "string") {
      throw new AppError("CEP com formato inválido", 400);
    }

    if (!data.zipCode || !data.zipCode.trim()) {
      throw new AppError("CEP é obrigatório", 400);
    }

    const zipCode = data.zipCode.trim();

    const existingAddress =
      await addressesRepository.findAddressByUserId(userId);

    if (existingAddress) {
      throw new AppError("Usuário já possui um endereço cadastrado", 409);
    }

    return addressesRepository.createAddress(userId, {
      street,
      number,
      city,
      state,
      zipCode,
    });
  }

  async getMyAddress(userId: number) {
    const address = await addressesRepository.findAddressByUserId(userId);

    if (!address) {
      throw new AppError("Endereço não encontrado", 404);
    }

    return address;
  }

  async updateMyAddress(userId: number, data: UpdateAddressDTO) {
    const existingAddress =
      await addressesRepository.findAddressByUserId(userId);

    if (!existingAddress) {
      throw new AppError("Endereço não encontrado", 404);
    }

    const updatedData: UpdateAddressDTO = {};

    if (data.street !== undefined) {
      if (typeof data.street !== "string") {
        throw new AppError("Rua com formato inválido", 400);
      }

      const street = data.street.trim();

      if (!street) {
        throw new AppError("Rua inválida", 400);
      }

      updatedData.street = street;
    }

    if (data.number !== undefined) {
      if (typeof data.number !== "string") {
        throw new AppError("Número com formato inválido", 400);
      }
      const number = data.number.trim();

      if (!number) {
        throw new AppError("Número inválido", 400);
      }
      updatedData.number = number;
    }

    if (data.city !== undefined) {
      if (typeof data.city !== "string") {
        throw new AppError("Cidade com formato inválido", 400);
      }
      const city = data.city.trim();

      if (!city) {
        throw new AppError("Cidade inválida", 400);
      }
      updatedData.city = city;
    }

    if (data.state !== undefined) {
      if (typeof data.state !== "string") {
        throw new AppError("Estado com formato inválido", 400);
      }
      const state = data.state.trim().toUpperCase();

      if (!state) {
        throw new AppError("Estado inválido", 400);
      }
      updatedData.state = state;
    }

    if (data.zipCode !== undefined) {
      if (typeof data.zipCode !== "string") {
        throw new AppError("CEP com formato inválido", 400);
      }
      const zipCode = data.zipCode.trim();

      if (!zipCode) {
        throw new AppError("CEP inválido", 400);
      }
      updatedData.zipCode = zipCode;
    }

    if (Object.keys(updatedData).length === 0) {
      throw new AppError("Nenhum campo válido enviado para atualização", 400);
    }

    return addressesRepository.updateAddressByUserId(userId, updatedData);
  }

  async deleteMyAddress(userId: number) {
    const existingAddress =
      await addressesRepository.findAddressByUserId(userId);

    if (!existingAddress) {
      throw new AppError("Endereço não encontrado", 404);
    }

    await addressesRepository.deleteAddressByUserId(userId);
  }
}
