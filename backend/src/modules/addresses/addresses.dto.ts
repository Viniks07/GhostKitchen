export interface CreateAddressDTO {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface UpdateAddressDTO {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}