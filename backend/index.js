function UploadProcess() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    // if (regex.test(fileUpload.value.toLowerCase())) {
    // if (typeof (FileReader) != "undefined") {
    var reader = new FileReader();

    //For Browsers other than IE.
    if (reader.readAsBinaryString) {
        reader.onload = function (e) {
            GetTableFromExcel(e.target.result);
        };
        reader.readAsBinaryString(fileUpload.files[0]);
    } else {
        //For IE Browser.
        reader.onload = function (e) {
            var data = "";
            var bytes = new Uint8Array(e.target.result);
            for (var i = 0; i < bytes.byteLength; i++) {
                data += String.fromCharCode(bytes[i]);
            }
            GetTableFromExcel(data);
        };
        reader.readAsArrayBuffer(fileUpload.files[0]);
    }
    //     } else {
    //         alert("This browser does not support HTML5.");
    //     }
    // } else {
    //     alert("Please upload a valid Excel file.");
    // }
};

function GetTableFromExcel(data) {
    //Read the Excel File data in binary
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //get the name of First Sheet.
    var Sheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);

    const rawData = [];
    const convertedData = [];

    const pillar = [
        { id: 1, name: "Karso Dimejo", breed: "-", parent: ["-", "-"] },
        { id: 2, pid: 1, tags:['partner'], name: "Marsinah", breed: "-", parent: ["-", "-"] },
        { id: 3, pid: 1, name: "Lasmi", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"]},
        { id: 4, pid: 1, name: "Mangun", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"] },
        { id: 5, pid: 1, name: "Sukidi", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"] },
        { id: 6, pid: 1, name: "Suryat", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"] },
        { id: 7, pid: 1, name: "Sunari", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"] },
        { id: 8, pid: 1, name: "Tumiran", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"] },
        { id: 9, pid: 1, name: "Kasini", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"] },
        { id: 10, pid: 1, name: "Amirah", breed: "Anak", parent: ["Karso Dimejo", "Marsinah"] }
    ];

    rawData.push(...pillar);

    excelRows.forEach((element, index) => {
        parentArray = toCamelCase(element["Anda merupakan anak dari pasangan"]).split('&');
        parentArray[1] = parentArray[1] ? parentArray[1].trim() : "unknown";
        parentArray = [parentArray[0].trim(), parentArray[1].trim()];
        rawData.push({
            id: index + 1 + pillar.length,
            name: toCamelCase(element["Masukkan nama lengkap anda"]).trim(),
            breed: element["Pilih trah keturunan anda"],
            parent: parentArray
        });
    });

    rawData.forEach((element) => {
        let parentId = undefined;
        let tags = undefined;
        rawData.some(getElement => {
          // menentukan id suami/istri
          if (element.name == getElement.parent[1]) {
            const elementParent = rawData.find(parent => parent.name === getElement.parent[0]);
            if (elementParent) {
              parentId = elementParent.id;
              tags = ['partner'];
              return true;
            }
          }
          // menentukan id orang tua
          else if (element.parent[0] == getElement.name) {
            parentId = getElement.id;
            return true;
          }
      
          return false;
        });
      
        const newData = {
          id: element.id,
          Nama: element.name,
          Trah: element.breed,
        };

        if (parentId != undefined) newData.pid = parentId;
        if (tags != undefined) newData.tags = tags;

        convertedData.push(newData);
      });

    // console.log(convertedData);
    exportJsonFile(convertedData, "silsilah.json");
}

function exportJsonFile(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2); // konversi data ke JSON string dengan indentasi 2 spasi
    const blob = new Blob([jsonStr], { type: "application/json" }); // buat blob dari JSON string dengan MIME type "application/json"
    const url = URL.createObjectURL(blob); // buat URL object dari blob
    const link = document.createElement("a"); // buat elemen anchor
    link.href = url; // set href elemen anchor ke URL object
    link.download = filename; // set atribut download elemen anchor ke nama file yang diinginkan
    link.click(); // klik elemen anchor untuk memulai download
}

function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}