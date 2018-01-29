import _extend from 'lodash/extend';

class Masker {

  get message() {
    if (!this._message) {
      this._message = null;
    }

    return this._message;
  }

  set message(message) {
    this._message = message;
  }

  mask(v) {
    return {
      value: v,
      message: this.message
    };
  }

  extend(props) {
    class NewMasker extends this.constructor {}

    _extend(NewMasker.prototype, props);

    return new NewMasker();

  }
}

export default new Masker();
