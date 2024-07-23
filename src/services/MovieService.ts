import axios from "axios";
import { CategoriesAPIResponseSchema, MoviesAPIResponse } from "../utils/movies-schema";
import { SearchFilter } from "../types";

// Función para obtener categorías de películas
export async function getCategories() {
    const appId = import.meta.env.VITE_API_KEY;
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${appId}&language=es-ES`;
    const { data } = await axios.get(url);

    const result = CategoriesAPIResponseSchema.safeParse(data);
    if (result.success) {
        return result.data;
    }
}

// Función para obtener películas filtradas por género y título
export async function getMovies(filters: SearchFilter) {
    const appId = import.meta.env.VITE_API_KEY;
    let url = '';

    // Si hay un título o nombre de reparto, usar el endpoint de búsqueda
    if (filters.title) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${appId}&language=es-ES&query=${encodeURIComponent(filters.title)}&include_adult=false&page=1`;
    } else {
        // Si no hay un título, usar el endpoint de descubrimiento
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${appId}&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
    }

    // Añadir el filtro de categoría si está presente y no es "Todo"
    if (filters.category) {
        url += `&with_genres=${filters.category}`;
    }

    console.log('Constructed URL:', url); // Imprimir la URL construida para depuración

    const { data } = await axios.get(url);
    const result = MoviesAPIResponse.safeParse(data);
    if(result.success){
        return result.data;
    }
}