class Channel {
    constructor(name, type = "text", isPrivate = false) {
      this.name = name; // Название канала
      this.type = type; // "text" или "voice"
      this.isPrivate = isPrivate; // Приватный канал или нет
      this.members = new Set(); // Участники канала
    }
  
    // Добавление пользователя в канал
    join(userId) {
      if (!this.members.has(userId)) {
        this.members.add(userId);
        return true;
      }
      return false;
    }
  
    // Удаление пользователя из канала
    leave(userId) {
      if (this.members.has(userId)) {
        this.members.delete(userId);
        return true;
      }
      return false;
    }
  
    // Проверка, есть ли пользователь в канале
    hasUser(userId) {
      return this.members.has(userId);
    }
  
    // Получение списка пользователей в канале
    getMembers() {
      return Array.from(this.members);
    }
  
    // Очистка канала (удаление всех пользователей)
    clear() {
      this.members.clear();
    }
  
    // Получение информации о канале
    getInfo() {
      return {
        name: this.name,
        type: this.type,
        isPrivate: this.isPrivate,
        members: this.getMembers(),
      };
    }
  }
  
  module.exports = Channel;
  