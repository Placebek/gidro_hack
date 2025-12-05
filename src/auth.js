// src/utils/auth.js

// Сохраняем токен и роль в localStorage
export function setUser({ token, role }) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
}

// Получаем роль пользователя
export function getRole() {
  return localStorage.getItem('role') || 'guest';
}

// Проверка роли
export function isExpert() {
  return getRole() === 'expert';
}

// Проверка авторизации
export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Удаляем токен (выход)
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}
