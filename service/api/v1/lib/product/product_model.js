export default class Product {
  constructor(name, { description, createdByUserId, ...otherAttributes } = {}) {
    this.name = name;
    this.description = description;
    this.createdByUserId = createdByUserId;
    this.attributes = otherAttributes;
  }

  valueOf() {
    return {
      name: this.name,
      description: this.description,
      createdByUserId: this.createdByUserId,
      ...this.attributes
    };
  }
}
