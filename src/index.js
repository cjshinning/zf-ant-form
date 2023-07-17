import React from 'react';
import ReactDOM from 'react-dom';
// import Form, { Field } from 'rc-field-form';
import Form, { Field } from './rc-field-form';

ReactDOM.render(
  <Form
    initialValues={{ username: '', password: '' }}
    onFinish={
      values => {
        console.log('成功', values);
      }
    }
    onFinishFailed={
      (errorInfo) => {
        console.log('失败', errorInfo);
      }
    }
  >
    <Field name='username' rules={[{ required: true, min: 3, max: 6 }]}>
      <input placeholder='用户名' />
    </Field>
    <Field name='password' rules={[{ required: true }]}>
      <input placeholder='密码' />
    </Field>
    <button htmltype='submit'>提交</button>
  </Form >, document.getElementById('root')
)

