export default class Feature {
  constructor(name, attributes) {
    this.attributes = { name, ...attributes };
  }

  setUpdatedAt(dateTime) {
    this.attributes.updatedAt = dateTime;
  }

  setEnabled(isEnabled) {
    this.attributes.enabled = isEnabled;
  }

  valueOf() {
    return this.attributes;
  }
}
