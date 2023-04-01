
function FileSizeCheck(file: File, maxSize: number) {

    if (file.size > mbToByte(maxSize)) {
        return false;
    } else {
        return true;
    }

}

function kbToByte(kb = 1) {
    return kb * 1024;
}

function mbToByte(mb = 1) {
    return mb * 1024 * 1024;
}

function byteToMb(byte = 1) {
    return byte / 1024 / 1024;
}

async function onSelectFile(files, maxFileNum, maxFileSize) {
    const limitSize = maxFileSize;
    let result = [];
    if (files && files[0]) {
        if (files.length > maxFileNum) {
            alert(`최대 파일 개수는 ${maxFileNum}개입니다.`)
            return;
        } else {
            let maxSize: number = 1024 * 1024 * maxFileSize;
            for (const file of files) {
                maxSize -= file.size;
                if (maxSize < 0) {
                    alert(`총 업로드 크기는 ${limitSize}mb입니다.`)
                    return;
                }
            }
        }
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = e => {
                result = [...result, { url: e.target.result, file: file }]
                // store.commit(storeArr, {url:e.target!.result, file:file})
            };
            reader.readAsDataURL(file);
        }
        return result;
    }
}

async function fileUpload(file: File) {
    const formData = new FormData()
    formData.append(file.name, file)

    const response = await $fetch<{
        result: Array<{
            priority: number
            name: string
            size: number
            type: string
            url: string
        }>
    }>('/community/att', getZempieFetchOptions('post', true, formData))

    return response

}

export {
    onSelectFile,
    FileSizeCheck,
    kbToByte,
    mbToByte,
    byteToMb,
    fileUpload,
}