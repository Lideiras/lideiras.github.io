import { project1 } from './project1.js';
import { project2 } from './project2.js';
import { project3 } from './project3.js';
import { project4 } from './project4.js';
import { project5 } from './project5.js';
import { project6 } from './project6.js';
import { project7 } from './project7.js';
import { project8 } from './project8.js';
import { project9 } from './project9.js';
import { project10 } from './project10.js';

// Array con todos los proyectos
export const allProjects = [
  project1,
  project2,
  project3,
  project4,
  project5,
  project6,
  project7,
  project8,
  project9,
  project10
];

// Función para obtener proyecto por ID
export const getProjectById = (id) => {
  return allProjects.find(project => project.id === id);
};

// Función para filtrar proyectos por categoría
export const getProjectsByCategory = (category) => {
  return allProjects.filter(project => project.category === category);
};

// Función para obtener proyectos por año
export const getProjectsByYear = (year) => {
  return allProjects.filter(project => project.year === year);
};

// Exportar proyectos individuales
export { project1, project2, project3, project4, project5, project6, project7, project8, project9, project10 };
