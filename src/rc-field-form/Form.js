import React from 'react';
import FieldContext from './FieldContext';
import useForm from './useForm';

/**
 * 这个是最外层的Form组件
 * @param {*} props 
 * initialValues 初始对象
 * onFinish 完成时的回调函数
 * @returns 
 */
const Form = ({ initialValues, onFinish, onFinishFailed, children }) => {
  let [formInstance] = useForm();
  formInstance.setCallbacks({
    onFinish,
    onFinishFailed
  })
  const mountRef = React.useRef(null);  //mountRef可以再多次渲染的时候保持不变
  formInstance.setInitialValues(initialValues, mountRef.current);
  if (!mountRef.current) {
    mountRef.current = true;
  }
  return (
    <form
      onSubmit={
        event => {
          event.preventDefault();
          event.stopPropagation();
          formInstance.submit();
        }
      }
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  )
}

export default Form;