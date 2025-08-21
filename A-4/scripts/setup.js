#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🍕 Configuración de la App de Pedidos Online');
console.log('============================================\n');

const questions = [
  {
    name: 'apiKey',
    question: 'Ingresa tu Firebase API Key: ',
    required: true
  },
  {
    name: 'authDomain',
    question: 'Ingresa tu Firebase Auth Domain: ',
    required: true
  },
  {
    name: 'projectId',
    question: 'Ingresa tu Firebase Project ID: ',
    required: true
  },
  {
    name: 'storageBucket',
    question: 'Ingresa tu Firebase Storage Bucket: ',
    required: true
  },
  {
    name: 'messagingSenderId',
    question: 'Ingresa tu Firebase Messaging Sender ID: ',
    required: true
  },
  {
    name: 'appId',
    question: 'Ingresa tu Firebase App ID: ',
    required: true
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    updateFirebaseConfig();
    return;
  }

  const question = questions[index];
  
  rl.question(question.question, (answer) => {
    if (question.required && !answer.trim()) {
      console.log('❌ Este campo es requerido. Por favor, ingresa un valor.\n');
      askQuestion(index);
      return;
    }
    
    answers[question.name] = answer.trim();
    askQuestion(index + 1);
  });
}

function updateFirebaseConfig() {
  const configPath = path.join(__dirname, '..', 'firebase', 'config.js');
  
  const configContent = `import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "${answers.apiKey}",
  authDomain: "${answers.authDomain}",
  projectId: "${answers.projectId}",
  storageBucket: "${answers.storageBucket}",
  messagingSenderId: "${answers.messagingSenderId}",
  appId: "${answers.appId}"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancia de Firestore
export const db = getFirestore(app);

export default app;
`;

  try {
    fs.writeFileSync(configPath, configContent);
    console.log('✅ Configuración de Firebase actualizada exitosamente!\n');
    
    console.log('📋 Próximos pasos:');
    console.log('1. Ejecuta: npm install');
    console.log('2. Ejecuta: npm start');
    console.log('3. Configura las reglas de seguridad en Firebase Console');
    console.log('4. (Opcional) Ejecuta el script de datos de ejemplo\n');
    
    console.log('🎉 ¡Tu aplicación está lista para usar!');
    
  } catch (error) {
    console.error('❌ Error al actualizar la configuración:', error.message);
  }
  
  rl.close();
}

// Verificar si ya existe una configuración
const configPath = path.join(__dirname, '..', 'firebase', 'config.js');
if (fs.existsSync(configPath)) {
  const currentConfig = fs.readFileSync(configPath, 'utf8');
  if (!currentConfig.includes('tu-api-key')) {
    console.log('⚠️  Ya existe una configuración de Firebase.');
    rl.question('¿Deseas sobrescribirla? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        askQuestion(0);
      } else {
        console.log('Configuración cancelada.');
        rl.close();
      }
    });
  } else {
    askQuestion(0);
  }
} else {
  askQuestion(0);
}
