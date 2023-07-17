import React from 'react';
import FieldContext from './FieldContext';

/**
 * 字段的组件
 * 类组件如何获取上下文对象的值？
 * 实现双向数据绑定
 * input的值显示的是formInstance.store对应的字段值
 * 当input值发现改变的时候把值放到formInstance.store上
 */
class Field extends React.Component {
  static contextType = FieldContext;
  // 当组件挂载完成后
  componentDidMount() {
    this.context.registerField(this);
  }
  onStoreChange = () => {
    this.forceUpdate();
  }
  getControlled = (childProps) => {
    let { name } = this.props;
    let { getFieldValue, setFieldValue } = this.context;
    return {
      ...childProps,
      value: getFieldValue(name),
      onChange: event => {
        setFieldValue(name, event.target.value)
      }
    }
  }
  render() {
    let children = this.props.children; //获取原来的儿子  <input placeholder='用户名' />
    return React.cloneElement(children, this.getControlled(children.props));
  }
}

export default Field;