import { check_rating } from './check_rating';
import { check_size } from './check_size';
import { check_versions } from './check_versions';
import { debloat } from './debloat';
import { download } from './download';
import { fetch_directory } from './fetch_directory';
import { npm_ingestion } from './npm_ingestion';
import { regex_search } from './regex_search';
import { update } from './update';
import { upload } from './upload';

export async function main() {
    if(check_rating) {
        check_rating();
    }
    if(check_size) {
        check_size();
    }
    if(check_versions) {
        check_versions();
    }
    if(debloat) {
        debloat();
    }
    if(download) {
        download();
    }
    if(fetch_directory) {
        fetch_directory();
    }
    if(npm_ingestion) {
        npm_ingestion();
    }
    if(regex_search) {
        regex_search();
    }
    if(update) {
        update();
    }
    if(upload) {
        upload();
    }
}