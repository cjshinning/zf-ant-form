import React from 'react';
import Schema from './async-validator';

class FormStore {
  constructor(forceRootRender) {
    this.forceRootRender = forceRootRender;
    this.store = {};  //用来存放表单值的对象
    this.callbacks = {};
    this.fieldEntities = [];
  }
  registerField = (fieldEntitie) => {
    this.fieldEntities.push(fieldEntitie);
  }
  getFieldsValue = () => {
    return this.store;
  }
  setFieldsValue = (newStore) => {
    this.store = { ...this.store, ...newStore };  //把newStore里的属性都赋值给this.store
    this._notifyAllEntities();
  }
  getFieldValue = (name) => {
    return this.store[name];  //获取store中的某个属性名称的值
  }
  _notifyAllEntities = () => {
    this.fieldEntities.forEach(entity => entity.onStoreChange())
  }
  setFieldValue = (name, value) => {
    this.store[name] = value;  //获取store中的某个属性名称的值
    this._notifyAllEntities();
  }
  setCallbacks = (callbacks) => {
    this.callbacks = callbacks;
    console.log(this.callbacks)
  }
  setInitialValues = (initialValues, mounted) => {
    if (!mounted) {
      this.store = { ...initialValues };
    }
  }
  submit = () => {
    this.validateFields()
      .then(values => {
        let { onFinish } = this.callbacks;
        if (onFinish) {
          onFinish(values);
        }
      }).catch(errorInfo => {
        let { onFinishFailed } = this.callbacks;
        if (onFinishFailed) {
          onFinishFailed(errorInfo);
        }
      })

  }
  // 校验表单的值
  validateFields = () => {
    let values = this.getFieldsValue();
    let descriptor = this.fieldEntities.reduce((descriptor, entity) => {
      let rules = entity.props.rules; //[{ required: true }, { min: 3 }, { max: 6 }]
      if (rules && rules.length > 0) {
        let config = rules.reduce((memo, rule) => {
          memo = { ...memo, ...rule };
          return memo;
        }, {})  //{ required: true, min: 3, max: 6 }
        descriptor[entity.props.name] = config;
      }
      return descriptor;
    }, {});  //
    return new Schema(descriptor).validate(values);
  }
  // 希望隐藏一些私有方法，想给别人用的才放到getForm
  getForm = () => {
    return {
      getFieldsValue: this.getFieldsValue,
      setFieldsValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      setFieldValue: this.setFieldValue,
      setCallbacks: this.setCallbacks,
      setInitialValues: this.setInitialValues,
      registerField: this.registerField,
      submit: this.submit
    }
  }
}

// 自定义hooks就是一个用use开头的函数，里面用到了其他的hooks
export default function useForm() {
  let formRef = React.useRef(); //{current:null} formRef 可以再多次组件渲染的时候保存不变 返回的是一个对象
  // 强行刷新组件的方法 因为对象的属性是有含义的，而数组可以任意定义变量名
  let [, forceUpdate] = React.useState({});
  if (!formRef.current) {
    const forceReRender = () => {
      forceUpdate({});  //调用此方法可以让组件刷新
    }
    let formStore = new FormStore(forceReRender);
    let formInstance = formStore.getForm();
    formRef.current = formInstance;
  }
  // 一般来说自定义hooks都要返回数组，因为方便扩展
  return [formRef.current];
}