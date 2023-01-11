//elementos
const notesContainer = document.querySelector('#notesContainer'); //div
const notesInput = document.querySelector('#noteContent'); //input
const notesAddBtn = document.querySelector('.addNote'); //button

//evento
notesAddBtn.addEventListener('click', () => {
    addNote()
});

//função de renderização das notas em tela 
function showNotes() {
    cleanNotes()
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    })
}

function cleanNotes() {
    notesContainer.replaceChildren([])
}

//função de gerarar id randomicamente
function generateId() {
    return Math.floor(Math.random() * 5000);
}

//função de add nota
function addNote() {
    //objeto de retorno para contrução da nota
    const noteObject = {
        id: generateId(),
        content: notesInput.value,
        fixed: false,
    };

    //limpa o campo no click do botão
    notesInput.value = '';

    //armazena as notas cem um array
    const notes = getNotes();

    //empurra o objeto para dentro do array
    notes.push(noteObject);

    //salva tudo que estiver dentro do array de objetos
    saveNotes(notes);

    //parametros requisitados do objeto
    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);
}

//função para criar nota
function createNote(id, content, fixed) {
    //criar uma div na variavel element
    const element = document.createElement('div');
    //add a classe note na varaivel element que agora é uma div
    element.classList.add('note');

    //criar um textarea na variavel textarea
    const textarea = document.createElement('textarea');
    //armazena o valor digitado na textarea no parametro content
    textarea.value = content;
    //cria um placeholder para a box do textarea
    textarea.placeholder = 'Adicione algum texto...';

    //traz o que esta dentro do textarea para o element 
    element.appendChild(textarea);

    //criar os icons 
    const pinIcon = document.createElement('i');
    //add classe aos icons
    pinIcon.classList.add(...['bi', 'bi-pin'])
    //traz o icon para dentro da variavel element
    element.appendChild(pinIcon);

    //alteração de class para o icon bi-pin
    if (fixed) {
        element.classList.add('fixed');
    } else {
        element.classList.remove('fixed');
    }

    //evento de click para o icon bi-pin
    element.querySelector('.bi-pin').addEventListener('click', () => {
        toogleFixnotes(id);
    });

    //criar os icons 
    const closedIcon = document.createElement('i');
    //add classe aos icons
    closedIcon.classList.add(...['bi', 'bi-x-lg'])
    //traz o icon para dentro da variavel element
    element.appendChild(closedIcon);

    //evento de click para o icon bi-x-lg
    element.querySelector('.bi-x-lg').addEventListener('click', () => {
        deleteNotes(id, element);
    });

    //criar os icons 
    const fileIcon = document.createElement('i');
    //add classe aos icons
    fileIcon.classList.add(...['bi', 'bi-file-earmark-plus'])
    //traz o icon para dentro da variavel element
    element.appendChild(fileIcon);

    //evento de click para o icon bi-x-lg
    element.querySelector('.bi-file-earmark-plus').addEventListener('click', () => {
        copyNotes(id);
    });

    //retorna o element finalizado
    return element;
}

//função de copia de notas
function copyNotes(id) {
    const notes = getNotes();

    const targetNotes = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id: generateId(),
        content: targetNotes.content,
        fixed: false,
    };

    const noteElement = createNote(
        noteObject.id,
        noteObject.content,
        noteObject.fixed,
    );

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);
}

//função de fixação das notas
function toogleFixnotes(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);
    showNotes()
}

//função para deletar notas
function deleteNotes(id, element) {
    //busca as notas no localStorage
    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes);

    //remove a nota
    notesContainer.removeChild(element);
}

//função de captura das notas do localStorage
function getNotes() {
    //busca as notas ou nada, desde que estaja em um objeto
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    //ordena as notas de acordo com a fixação
    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));
    //retorn as notas ordenadas
    return orderedNotes;
}

//função de salvamento da nota em localStorage
function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

//inicialização
showNotes();