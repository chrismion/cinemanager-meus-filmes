// Definindo o tipo (molde) para os nossos filmes
// Isso ajuda a garantir que todo filme tenha essas propriedades
export interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  genre: string;
  rating: number; // Nota de 1 a 5
  imageUrl: string;
  description: string;
}

// Tipo para as Props (propriedades) que passamos para o cartão do filme
export interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

// Tipo para as Props do Formulário
export interface MovieFormProps {
  currentMovie?: Movie | null; // Pode ser nulo se estiver criando um novo
  onSave: (movie: Movie) => void;
  onCancel: () => void;
}