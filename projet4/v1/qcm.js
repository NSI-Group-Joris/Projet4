const qcmDiv = document.getElementById('QCM');
const nameEntry = document.getElementById('nameEntry');
const submitButton = document.getElementById('submit-qcm');
const restartButton = document.getElementById('restart-qcm');

function ScoreObtenu(){
    // Amélioration : Vérifie si le nom est valide
    if (isValidName(nameEntry.value) === false) {
        AlertMessage('Vous devez entrer un nom valide ! (max: 16 caractères)', 'rgb(255, 0, 0)');
        return;
    }

    // Amélioration : Vérifier si toutes les questions ont été cochées
    if (CheckAllQuestions() === false) {
        AlertMessage('Vous devez répondre à toutes les questions !', 'rgb(255, 0, 0)');
        return;
    }

    // Calculer le score
    let score = 0;
    for (let i = 1; i < 4; i++) {
        const rep = document.getElementById('rep'+i);
        if (rep.checked === true) {
            score++;
        }
    }

    
    submitButton.style.display = 'none'; // Cacher le bouton "Valider"
    restartButton.style.display = 'inline'; // Afficher le bouton "Recommencer"

    FeedbackScore(score); // Amélioration : Feedback pour le score
    ShowAnswers(); // Amélioration : Affichage des bonnes et mauvaises réponses en couleurs
}

function Init(){
    nameEntry.value=''; // Effacer le nom entré par l'utilisateur
    AlertMessage('',''); // Effacer le message d'alerte
    ResetColors(); // Amélioration - Bug fix : Remettre les réponses en blanc

    restartButton.style.display = 'none'; // Cacher le bouton "Recommencer"
    submitButton.style.display = 'inline'; // Afficher le bouton "Valider"

    // Décocher toutes les cases
    document.querySelectorAll('fieldset input[type="radio"]').forEach(function(radio) {
        radio.checked = false; 
    });
}

/**
    Amélioration : Feedback pour le score
*/

function FeedbackScore(score) {
    let total = qcmDiv.querySelectorAll('fieldset').length - 1;
    if (score/total == 0) {
        AlertMessage("Dommage " + nameEntry.value + ", vous n'avez aucune bonne réponse! 💀", "rgb(148, 0, 0)");
    } else if (score/total < 0.5) {
        AlertMessage('Oups, il faudrait peut-être recommencer ' + nameEntry.value + ', votre score est de '+score+'/'+total+'! 😬', "rgb(255, 0, 0)");
    } else if (score/total < 1) {
        AlertMessage('Bravo ' + nameEntry.value + ', votre score est de '+score+'/'+total+'! 🧠', "rgb(255, 144, 39)");
    } else {
        AlertMessage('Parfait ' + nameEntry.value + '! Votre score est de 100% 👌', "rgb(0, 190, 0)");
    }
};

/** 
    Amélioration : Vérifier si toutes les questions ont été cochées
*/

function CheckAllQuestions() {
    const radios = document.querySelectorAll('fieldset input[type="radio"]');
    let checked = 0;
    radios.forEach(function(radio) {
        if (radio.checked) {
            checked++;
        }
    });
    if (checked < qcmDiv.querySelectorAll('fieldset').length-1) {
        return false;
    }
    return true;
}

/**
    Amélioration : Vérifier si le nom est valide (pas vide, pas trop long)
*/

function isValidName(name) {
    const maxLength = 16; // Longueur maximale du nom
    const minLength = 1; // Longueur minimale du nom
    return name.length >= minLength && name.length <= maxLength;
}

/**
    Amélioration : Texte d'alerte / de score
*/

const reponse = document.getElementById('reponse');
function AlertMessage(text, color) {
    if (text === '') {
        reponse.style.display = 'none';
    } else {
        reponse.style.color = color;
        reponse.innerHTML = text;
        reponse.style.display = 'block';
    }
}

/**
    Amélioration : Popup déplaceable (apparition/déplacement)
*/

const blurOverlay = document.getElementById('blur-overlay');
const qcmHeader = document.getElementById('QCM-Header');

function AfficherQCM() {
    qcmDiv.style.display = 'block';
    blurOverlay.style.display = 'block';
    Init();
    scrollTo(0, 0); // Remonter en haut de la page pour voir le QCM
    // Center le QCM
    qcmDiv.style.left = "50%";
    qcmDiv.style.top = "50%";
}

function FermerQCM() {
    qcmDiv.style.display = 'none';
    blurOverlay.style.display = 'none';
}

let isDragging = false;
let offsetX, offsetY;

qcmHeader.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX =  qcmDiv.getBoundingClientRect().width/2 - (e.clientX - qcmDiv.getBoundingClientRect().left);
    offsetY =  qcmDiv.getBoundingClientRect().height/2 - (e.clientY - qcmDiv.getBoundingClientRect().top);
    qcmDiv.style.cursor = 'move';
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        if (e.clientX < 0 || e.clientY < 0) { return; }
            
        qcmDiv.style.left = (e.clientX + offsetX) + 'px'; 
        qcmDiv.style.top = (e.clientY + offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    qcmDiv.style.cursor = 'default';
});


/**
    Amélioration : Affichage des bonnes et mauvaises réponses en couleurs
*/

function ShowAnswers() {
    for (let i = 1; i < qcmDiv.querySelectorAll('fieldset').length; i++) {
        const radios = document.getElementsByName('rep' + i);
        for (let j = 0; j < radios.length; j++) {
            if (radios[j].id == ('rep' + i)) {
                radios[j].parentNode.style.color = "rgb(0, 255, 0)";
            } else {
                radios[j].parentNode.style.color = "rgb(255, 0, 0)";
            }
        }
    }
}

function ResetColors() {
    for (let i = 1; i < qcmDiv.querySelectorAll('fieldset').length; i++) {
        const radios = document.getElementsByName('rep' + i);
        for (let j = 0; j < radios.length; j++) {
                radios[j].parentNode.style.color = "white";
        }
    }
}