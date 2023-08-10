# Vue 3 + TypeScript + Vite

```shell
pnpm install
pnpm run dev
```

git 操作

```shell
删除本地分支
git branch -d remoteBranchName
删除远程分支
git push origin --delete remoteBranchName
```

docker run \
-p 80:80 \
--name poster-web \
-v /home/power/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/power/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /home/power/nginx/log:/var/log/nginx \
-v /home/power/nginx/html:/usr/share/nginx/html \
-d nginx:latest
