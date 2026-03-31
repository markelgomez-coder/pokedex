export type Pokemon = {
    nombre: string,
    numero: number,
    imagen: string,
    tipos: Array<string>,
    peso: number,
    altura: number,
    hp: number,
    atk: number,
    def: number,
    sat: number,
    sdf: number,
    spd: number,
}

export type Type = {
    nombre: string,
    url: string,
}

export type TipoPokemon = {
    nombre: string,
    type:Type,
}

export type DanoPokemon = {
    nombre: string,
}