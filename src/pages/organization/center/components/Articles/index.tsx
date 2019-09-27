import { Icon, List, Tag, Avatar } from 'antd';
import React from 'react';
import { Article } from '../../../../../types';

import { ModalState } from '../../model';
import styles from './index.less';

@connect(
  ({
    loading,
    organizationCenter,
  }: {
    loading: { effects: { [key: string]: boolean } };
    organizationCenter: ModalState;
  }) => ({
    articles: organizationCenter.articles,
    articlesLoading: loading.effects['organizationCenter/fetchArticles'],
  }),
)
const IconText: React.FC<{
  type: string;
  text: React.ReactNode;
}> = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

type Props = Partial<ModalState> & { articles: Article[]; articlesLoading: boolean };

// const fetchComments = (articleId: string) => {};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  1 + 1;
  return (
    <List.Item
      actions={[
        <IconText key="like" type="like-o" text={article.likes} />,
        // <IconText
        //   key="message"
        //   type="message"
        //   text="Комментировать"
        //   onClick={() => fetchComments(article.idWallRecord)}
        // />,
      ]}
    >
      <List.Item.Meta avatar={<Avatar src={article.poster} />} description={article.textContent} />
    </List.Item>
  );
};

const Articles: React.FC<Props> = props => {
  const { articles, articlesLoading } = props as any;

  return (
    <List<Article>
      size="large"
      className={styles.articleList}
      loading={articlesLoading}
      rowKey="id"
      itemLayout="vertical"
      dataSource={articles || []}
      renderItem={(item: Article) => <ArticleCard article={item} key={item.idWallRecord} />}
    />
  );
};

export default Articles;
