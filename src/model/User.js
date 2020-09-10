export class User {
    constructor(id, name, surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    getFullName() {
        return `${this.name} ${this.surname}`
    }

    getMentionById() {
        return `#id${this.id}`
    }

    getMentionByFullNameMarkdown() {
        return `[${this.name} ${this.surname}](tg://user?id=${this.id}) [${this.getMentionById()}]`
    }

    getMentionByFullNameHtml() {
        return `<a href="tg://user?id=${this.id}">${this.getFullName()}</a> [${this.getMentionById()}]`
    }
}
