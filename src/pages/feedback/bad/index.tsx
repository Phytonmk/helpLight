import Link from 'umi/link';
import { Result, Button } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';

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
        <p>Мы проанализируем ситуацию и постараемся сделать платформу лучше.</p>
        <br />
        <br />
        <Link to="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </div>
    }
  />
);
