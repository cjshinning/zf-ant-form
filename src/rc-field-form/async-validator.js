class Schema {
  constructor(descriptor) {
    this.descriptor = descriptor;
  }
  validate(values) {
    return new Promise((resolve, reject) => {
      let errorFields = [];
      for (let name in this.descriptor) {
        let rules = this.descriptor[name];
        let ruleKeys = Object.keys(rules);  //
        let errors = [];
        let value = values[name];
        for (let i = 0; i < ruleKeys.length; i++) {
          let ruleKey = ruleKeys[i];
          if (ruleKey === 'required') {
            if (rules[ruleKey] && !value) {
              errors.push(`${name} is required`);
            }
          } else if (ruleKey === 'min') {
            if (value.length < rules[ruleKey]) {
              errors.push(`${name} at least ${rules[ruleKey]} words`);
            }
          } else if (ruleKey === 'max') {
            if (value.length > rules[ruleKey]) {
              errors.push(`${name} at most ${rules[ruleKey]} words`);
            }
          }
        }
        if (errors.length > 0) {
          errorFields.push({ name, errors });
        }
      }
      if (errorFields > 0) {
        reject({ errorFields, values });
      } else {
        resolve(values);
      }
    })
  }
}

export default Schema;

// const descriptor = {
//   name: {
//     required: true, min:3, max: 6
//   },
//   age: {
//     required: true
//   },
// };