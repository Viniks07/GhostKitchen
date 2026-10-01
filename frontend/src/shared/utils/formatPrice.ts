export function formatPrice(priceInCents:number):string{
    return new Intl.NumberFormat("pt-br", {
        style:"currency",
        currency:"BRL",
    }).format(priceInCents / 100)
}