import { AppError } from "../../shared/errors/AppError.js";
import { AddressesRepository } from "./addresses.repository.js";
import type { CreateAddressDTO, UpdateAddressDTO } from "./addresses.dto.js";

const addressesRepository = new AddressesRepository();

export class AddressesService {
  async create(userId: number, data: CreateAddressDTO) {
    if (!data.street || !data.street.trim()) {
      throw new AppError("Rua é obrigatória", 400);
    }

    const street = data.street.trim();

    if (!data.number || !data.number.trim()) {
      throw new AppError("Número é obrigatório", 400);
    }

    const number = data.number.trim();

    if (!data.city || !data.city.trim()) {
      throw new AppError("Cidade é obrigatória", 400);
    }

    const city = data.city.trim();

    if (!data.state || !data.state.trim()) {
      throw new AppError("Estado é obrigatório", 400);
    }

    const state = data.state.trim().toUpperCase();

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
      const street = data.street.trim();

      if (!street) {
        throw new AppError("Rua inválida", 400);
      }

      updatedData.street = street;
    }

    if (data.number !== undefined) {
      const number = data.number.trim();

      if (!number) {
        throw new AppError("Número inválido", 400);
      }
      updatedData.number = number;
    }

    if (data.city !== undefined) {
      const city = data.city.trim();

      if (!city) {
        throw new AppError("Cidade inválida", 400);
      }
      updatedData.city = city;
    }

    if (data.state !== undefined) {
      const state = data.state.trim().toUpperCase();

      if (!state) {
        throw new AppError("Estado inválido", 400);
      }
      updatedData.state = state;
    }

    if (data.zipCode !== undefined) { 
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

  async deleteMyAddress(userId: number){
    const existingAddress = await addressesRepository.findAddressByUserId(userId);

    if (!existingAddress) {
      throw new AppError("Endereço não encontrado", 404);
    }

    await addressesRepository.deleteAddressByUserId(userId);
  }

}
