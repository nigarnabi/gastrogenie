'use server';

const API_KEY = process.env.SPOONACULAR_API_KEY as string;

interface FetchRecepiesParams {
    ingrideints: string[];
    number?: number
}

interface FetchIngredientsParams {
    query: string;
    number?: number
}

export const fetchReceipes = async (data : FetchRecepiesParams) => {
    let ingridientsFormatted = "";
    (data.ingrideints || []).forEach((ingridient, index) => {
        ingridientsFormatted += index == 0 ? ingridient.trim() : `,+${ingridient.trim()}`;
    });
    console.log(ingridientsFormatted);
    const params = new URLSearchParams({
        apiKey: API_KEY,
        ingredients: ingridientsFormatted,
        number: (data.number || 10).toString()
    }).toString();
    return await(await fetch(`https://api.spoonacular.com/recipes/findByIngredients?${params}`)).json().catch(e => []) as any[];
}



export const fetchIngredients = async (data: FetchIngredientsParams) => {
    const params = new URLSearchParams({
        apiKey: API_KEY,
        query: data.query,
        number: (data.number || 10).toString()
    }).toString();
    return await(await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?${params}`)).json().catch(e => [])  as any[];
}