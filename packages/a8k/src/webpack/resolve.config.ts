import WebpackChain from 'webpack-chain';
import A8k from '..';
import { BUILD_TARGET } from '../const';
import { IResolveWebpackConfigOptions } from '../interface';

export default (config: WebpackChain, context: A8k, { type }: IResolveWebpackConfigOptions) => {
  const { resolve } = config;
  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
  extensions.forEach((ext: string) => {
    if (type && type !== BUILD_TARGET.BROWSER) {
      resolve.extensions.add(`.${type}${ext}`);
    }
    resolve.extensions.add(ext);
  });

  // 避免在开发模式下面link全局的模块时无法正确编译，需要配置额外的参数
  resolve.symlinks(false);

  // 添加默认的~作为根路径
  resolve.alias.set('~', context.resolve('src'));

  const ownModules = context.rootResolve('node_modules');
  const projectModules = context.resolve('node_modules');
  resolve.modules
    .add('node_modules') // 相对目录优先
    .add(projectModules) // 项目node_modules
    .add(ownModules) // a8k node_modules
    // 这种方式应该被遗弃,不推荐使用,因为和node_modules目录中的模块可能发生冲突
    .add(context.resolve('src')); // 项目根目录

  config.resolveLoader.modules
    .add(ownModules)
    .add(projectModules)
    .add('node_modules');
};