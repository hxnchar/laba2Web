import React, { useState } from 'react';
import { Input } from './Input';

export const Form = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const formData = {
    email,
    name,
    password,
    passwordConfirm,
  };
  const onSubmit = e => {
    e.preventDefault();
    fetch('https://2laba-dev-react.vercel.app/api/sendMail', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  return (
    <form onSubmit={e => onSubmit(e)}>
      <Input
        placeholder="Enter email"
        type="email"
        label="Email"
        value={email}
        setValue={setEmail}
      />
      <Input
        placeholder="Enter name"
        type="text"
        label="Name"
        value={name}
        setValue={setName}
      />
      <Input
        placeholder="Enter password"
        type="password"
        label="Password"
        value={password}
        setValue={setPassword}
      />
      <Input
        placeholder="Confirm password"
        type="password"
        label="Confirm password"
        value={passwordConfirm}
        setValue={setPasswordConfirm}
      />
      <Input type="submit" />
    </form>
  );
};
