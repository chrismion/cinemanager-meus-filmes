import { Movie } from './types';

// Dados iniciais para o site não abrir vazio
export const INITIAL_MOVIES: Movie[] = [
  {
    id: 1,
    title: "A Origem",
    director: "Christopher Nolan",
    year: 2010,
    genre: "Ficção Científica",
    rating: 5,
    imageUrl: "https://picsum.photos/id/1015/400/600",
    description: "Dom Cobb é um ladrão habilidoso, o melhor na perigosa arte da extração."
  },
  {
    id: 2,
    title: "O Poderoso Chefão",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "Crime",
    rating: 5,
    imageUrl: "https://picsum.photos/id/1025/400/600",
    description: "O patriarca idoso de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante."
  },
  {
    id: 3,
    title: "Interestelar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Aventura",
    rating: 4,
    imageUrl: "https://picsum.photos/id/1002/400/600",
    description: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço."
  }
];