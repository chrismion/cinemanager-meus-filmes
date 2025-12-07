import { Movie } from './types';
import { INITIAL_MOVIES } from './constants';

// --- VARIÁVEIS GLOBAIS (ESTADO) ---
// Aqui a gente guarda os dados na memória do navegador.
// Se der F5, volta pro inicial porque não estamos usando Banco de Dados.

let movies: Movie[] = [...INITIAL_MOVIES]; // Começa com a lista de exemplo
let searchTerm: string = ''; // O que o usuário digitou na busca

// --- DECLARAÇÃO DO LUCIDE (Ícones) ---
// O typescript reclama que 'lucide' não existe, então a gente avisa que existe no window
declare const lucide: any;

// --- FUNÇÕES DE AJUDA (Auxiliares) ---

// Essa função gera o HTML das estrelinhas baseado na nota (1 a 5)
function getStarsHTML(rating: number): string {
    let html = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            // Estrela amarela (cheia)
            html += `<i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-yellow-400"></i>`;
        } else {
            // Estrela cinza (vazia)
            html += `<i data-lucide="star" class="w-4 h-4 text-gray-500"></i>`;
        }
    }
    return html;
}

// --- FUNÇÕES DE CRUD (Create, Read, Update, Delete) ---

// READ: Função principal que desenha os filmes na tela
function renderMovies() {
    console.log("Renderizando filmes...");

    const gridElement = document.getElementById('movies-grid');
    const counterElement = document.getElementById('movies-counter');
    const emptyStateElement = document.getElementById('empty-state');

    // Segurança: se não achar os elementos, para tudo
    if (!gridElement || !counterElement || !emptyStateElement) return;

    // Filtra a lista baseado no que foi digitado
    const filteredMovies = movies.filter(movie => {
        const text = searchTerm.toLowerCase();
        return movie.title.toLowerCase().includes(text) || 
               movie.genre.toLowerCase().includes(text);
    });

    // Atualiza o contador lá em cima
    counterElement.innerText = `Mostrando ${filteredMovies.length} filme(s)`;

    // Limpa o grid atual para desenhar de novo do zero
    gridElement.innerHTML = '';

    if (filteredMovies.length === 0) {
        // Se não tem filme, esconde o grid e mostra a mensagem de vazio
        gridElement.classList.add('hidden');
        emptyStateElement.classList.remove('hidden');
        emptyStateElement.classList.add('flex'); // Para ficar centralizado
    } else {
        // Se tem filmes, esconde a mensagem de vazio e mostra o grid
        emptyStateElement.classList.add('hidden');
        emptyStateElement.classList.remove('flex');
        gridElement.classList.remove('hidden');

        // Loop para criar o HTML de cada cartão
        filteredMovies.forEach(movie => {
            // Criando o HTML do cartão usando Template String (essas aspas tortas ` `)
            // É feio misturar HTML no JS, mas é assim que faz sem React
            const cardHTML = `
                <div class="bg-brand-light rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-700 flex flex-col h-full animate-fade-in">
                    <div class="relative h-64 overflow-hidden group">
                        <img src="${movie.imageUrl}" alt="${movie.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-bold">
                            ${movie.year}
                        </div>
                    </div>
                    <div class="p-5 flex-1 flex flex-col">
                        <div class="mb-2">
                             <span class="text-xs font-semibold text-brand-accent uppercase tracking-wider">${movie.genre}</span>
                            <h3 class="text-xl font-bold text-white mb-1 leading-tight">${movie.title}</h3>
                            <p class="text-sm text-gray-400">Dir. ${movie.director}</p>
                        </div>
                        <div class="flex gap-1 mb-4">
                            ${getStarsHTML(movie.rating)}
                        </div>
                        <p class="text-gray-300 text-sm mb-6 line-clamp-3 flex-1">${movie.description}</p>
                        
                        <div class="flex gap-3 mt-auto pt-4 border-t border-gray-700">
                            <!-- Botões com Data Attributes para sabermos qual ID mexer -->
                            <button onclick="startEdit(${movie.id})" class="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                <i data-lucide="edit-2" class="w-4 h-4"></i> Editar
                            </button>
                            <button onclick="deleteMovie(${movie.id})" class="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                <i data-lucide="trash-2" class="w-4 h-4"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            `;
            // Adiciona esse HTML dentro do grid
            gridElement.innerHTML += cardHTML;
        });
    }

    // Importante: Mandar o Lucide procurar os ícones novos que acabamos de colocar no HTML
    lucide.createIcons();
}

// DELETE: Apagar filme
// Precisei colocar no objeto 'window' para o HTML (onclick="") conseguir enxergar essa função
(window as any).deleteMovie = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este filme?")) {
        // Filtra tirando o ID selecionado
        movies = movies.filter(m => m.id !== id);
        renderMovies(); // Desenha a tela de novo
    }
};

// NAVEGAÇÃO: Função para mostrar o formulário
function showFormScreen(isEditing: boolean) {
    const listScreen = document.getElementById('screen-list');
    const formScreen = document.getElementById('screen-form');
    const searchContainer = document.getElementById('search-container');
    const formTitle = document.getElementById('form-title');

    if (listScreen && formScreen && searchContainer && formTitle) {
        listScreen.classList.add('hidden');       // Esconde lista
        searchContainer.classList.add('hidden');  // Esconde busca
        formScreen.classList.remove('hidden');    // Mostra form
        
        formTitle.innerHTML = isEditing 
            ? '<i data-lucide="edit" class="w-6 h-6"></i> Editar Filme' 
            : '<i data-lucide="plus" class="w-6 h-6"></i> Novo Filme';
            
        lucide.createIcons();
    }
}

// NAVEGAÇÃO: Função para voltar pra lista
function showListScreen() {
    const listScreen = document.getElementById('screen-list');
    const formScreen = document.getElementById('screen-form');
    const searchContainer = document.getElementById('search-container');

    if (listScreen && formScreen && searchContainer) {
        formScreen.classList.add('hidden');
        listScreen.classList.remove('hidden');
        searchContainer.classList.remove('hidden');
    }
}

// PREPARAR CRIAÇÃO
function startCreate() {
    // Limpa os campos do formulário
    (document.getElementById('input-id') as HTMLInputElement).value = '';
    (document.getElementById('input-title') as HTMLInputElement).value = '';
    (document.getElementById('input-director') as HTMLInputElement).value = '';
    (document.getElementById('input-year') as HTMLInputElement).value = '';
    (document.getElementById('input-genre') as HTMLSelectElement).value = '';
    (document.getElementById('input-rating') as HTMLInputElement).value = '3';
    (document.getElementById('input-image') as HTMLInputElement).value = '';
    (document.getElementById('input-description') as HTMLTextAreaElement).value = '';

    showFormScreen(false); // false = criando novo
}

// PREPARAR EDIÇÃO (UPDATE)
(window as any).startEdit = (id: number) => {
    // Acha o filme na lista pelo ID
    const movieToEdit = movies.find(m => m.id === id);

    if (movieToEdit) {
        // Preenche os inputs com os dados do filme
        (document.getElementById('input-id') as HTMLInputElement).value = movieToEdit.id.toString();
        (document.getElementById('input-title') as HTMLInputElement).value = movieToEdit.title;
        (document.getElementById('input-director') as HTMLInputElement).value = movieToEdit.director;
        (document.getElementById('input-year') as HTMLInputElement).value = movieToEdit.year.toString();
        (document.getElementById('input-genre') as HTMLSelectElement).value = movieToEdit.genre;
        (document.getElementById('input-rating') as HTMLInputElement).value = movieToEdit.rating.toString();
        (document.getElementById('input-image') as HTMLInputElement).value = movieToEdit.imageUrl;
        (document.getElementById('input-description') as HTMLTextAreaElement).value = movieToEdit.description;

        showFormScreen(true); // true = editando
    }
};

// SAVE: Salvar o formulário (Serve para Criar e Atualizar)
function handleSave(event: Event) {
    event.preventDefault(); // Não deixa a página recarregar

    // Pega os valores dos inputs
    const idStr = (document.getElementById('input-id') as HTMLInputElement).value;
    const title = (document.getElementById('input-title') as HTMLInputElement).value;
    const director = (document.getElementById('input-director') as HTMLInputElement).value;
    const year = parseInt((document.getElementById('input-year') as HTMLInputElement).value);
    const genre = (document.getElementById('input-genre') as HTMLSelectElement).value;
    const rating = parseInt((document.getElementById('input-rating') as HTMLInputElement).value);
    const description = (document.getElementById('input-description') as HTMLTextAreaElement).value;
    
    // Se imagem estiver vazia, pega uma aleatoria
    let imageUrl = (document.getElementById('input-image') as HTMLInputElement).value;
    if (!imageUrl) {
        imageUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/600`;
    }

    // Se o campo ID tinha valor, é EDIÇÃO. Se tava vazio, é NOVO.
    if (idStr) {
        // --- ATUALIZAR ---
        const id = parseInt(idStr);
        // Percorre a lista e substitui o filme com aquele ID
        movies = movies.map(m => {
            if (m.id === id) {
                return { id, title, director, year, genre, rating, imageUrl, description };
            }
            return m;
        });
    } else {
        // --- CRIAR ---
        const newMovie: Movie = {
            id: Date.now(), // Gera um ID único baseado no tempo
            title, director, year, genre, rating, imageUrl, description
        };
        movies.push(newMovie);
    }

    showListScreen();
    renderMovies();
}


// --- INICIALIZAÇÃO (Configurar os eventos) ---

// Espera o HTML carregar para rodar o JS
document.addEventListener('DOMContentLoaded', () => {
    
    // Renderiza a primeira vez
    renderMovies();

    // Configura o botão de Adicionar
    const btnAdd = document.getElementById('btn-add-new');
    if (btnAdd) btnAdd.addEventListener('click', startCreate);

    // Configura o botão de Cancelar do form
    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) btnCancel.addEventListener('click', showListScreen);

    // Configura o submit do formulário
    const form = document.getElementById('movie-form');
    if (form) form.addEventListener('submit', handleSave);

    // Configura a busca (toda vez que digita uma tecla)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = (e.target as HTMLInputElement).value;
            renderMovies();
        });
    }
});
