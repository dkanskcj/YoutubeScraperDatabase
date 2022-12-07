import { Transform } from "class-transformer";
import { CreateVideoType } from "./dtos/typeDto/create-video.type";

export class VideoDTO {
    title:string;
    category:CreateVideoType;

    @Transform((url)=>{
        let youtube = 'https://www.youtube.com/embed';

        if (url.value.indexOf("https://www.youtube.com") === 0) {
        url.value = url.value.substring(23);
        url.value = youtube.concat(url.value);
      }
      else if(url.value.indexOf("http://www.youtube.com") === 0){
        url.value = url.value.substring(22);
        url.value = youtube.concat(url.value);
      }
      else if (url.value.indexOf("https://youtu.be") === 0) {
        url.value = url.value.substring(16);
        url.value = youtube.concat(url.value);
      }

      return url.value;
    })
    url:string;
}