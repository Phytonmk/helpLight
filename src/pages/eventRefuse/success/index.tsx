import Link from 'umi/link';
import { Result, Button } from 'antd';
import React from 'react';

export default () => (
  <Result
    status="403"
    title="Оуф..."
    style={{
      background: 'none',
    }}
    subTitle="Мы сожалеем что так получилось"
    extra={
      <div>
        <p>Надеемся, что в дальнейшем вы не будете отказываться от участия</p>
        <br />
        <br />
        <Link to="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </div>
    }
  />
);
