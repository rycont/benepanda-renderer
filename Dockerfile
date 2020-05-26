FROM zmotula/pdfjam:latest AS PDFJAM
FROM node:latest
RUN git clone https://github.com/rycont/benepanda-renderer
WORKDIR benepanda-renderer
RUN npm i
COPY --from=PDFJAM /usr/local/texlive /usr/local/texlive
ENV PATH /usr/local/texlive/bin/x86_64-linux:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH
ENV port 8080
RUN chmod 777 ./
RUN mkdir pdf
# ENTRYPOINT npm run dev
EXPOSE 8080
#깡은 과학이다