class Message {
    constructor(channel, sender, text) {
      this.channel = channel; // Канал, в который отправлено сообщение
      this.sender = sender; // Отправитель (имя пользователя или ID)
      this.text = text.trim(); // Убираем пробелы по краям
      this.timestamp = new Date(); // Время отправки
    }
  
    // Получение данных сообщения в виде объекта
    toJSON() {
      return {
        channel: this.channel,
        sender: this.sender,
        text: this.text,
        timestamp: this.timestamp.toISOString(),
      };
    }
  
    // Проверка, является ли сообщение валидным
    isValid() {
      return (
        this.channel &&
        typeof this.sender === "string" &&
        this.sender.length > 0 &&
        typeof this.text === "string" &&
        this.text.length > 0
      );
    }
  }
  
  module.exports = Message;
  