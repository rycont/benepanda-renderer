FROM zmotula/pdfjam:latest AS PDFJAM
FROM dpokidov/imagemagick AS MAGICK
FROM node:latest

ENV PATH /usr/local/texlive/bin/x86_64-linux:/usr/bin/gs:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH
ENV port 8080
ADD ./image_magick-policy.xml /etc/ImageMagick-6/policy.xml

RUN apt-get update && apt-get -y install ghostscript && apt-get clean
COPY --from=PDFJAM /usr/local/texlive /usr/local/texlive

RUN git clone https://github.com/rycont/benepanda-renderer
WORKDIR ./benepanda-renderer
RUN mkdir pdf
RUN mkdir thumbnail
RUN npm i
RUN chmod 777 ./
ENTRYPOINT npm run dev
EXPOSE 8080
