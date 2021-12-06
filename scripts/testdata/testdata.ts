const duckData = "0x00012727010401010d020102030102050e0102010e0102010a010f0102010e0102040e0110050e05010401010e01010103010401020111010e0311010e0111010e01110302010e0102020e011201130114020e01050104010e05010401010e0103010501020211010e0311010e0111020e0211020e0111030e0202020e01150105010e0103040103010103010e010501020311010e0311010e0211010e0211010e0211020e0311050e01030401020101030105050e0111050e0202040e01020111020e0311020e0111010e0204010303010201010301050116020e011701180111050e0302020e0302040e0111020e0211010e01050104010302010203010501060119011a011b020202110d02091101020105010302010101010301050119011a011b011c011d04020b1e0202081101020105010401030101010301050119011a011b011f011d012002210102061e0202051e02020311030e0111040e010101040105012201230124011d012002210102061e0102081e01020211070e011e020e01030105012501260127012803210102021e0202031e0302051e0302080e011e010e010501190129012a012b012c03210102011e0102012d012e0102011e0102012e012d012e0102051e0102012f0a0e01050122013001310132013302210134012f0102012e012d012e0102011e0102012e012d012e0102051e010201350121080e01030105013601260127012003210137013801020239011e0102011e01020139011e0202061e010201210133060e0105010301050129013a012b012c0221013b013c020202390202011e010201390302061e01020221013d040e01060105010301050129013a013e013301210134013b0102013f010202390202011e010201390302011e0402011e010201400121014101420143020e01060105010301050129013a013e01330121013701440102023f01020139040201390402043f020201400221014501460147013601060105010301050129013a013e0133013b01480802013f010202390202023f0202023f01020240012101330149012a0129010e0105010301050129013a013e0133013b0102083f0502053f0102023f0102024001330149014a012901060105010e01060129013a013e01330102023f04020c3f0102013f0102013f0102024001330149014a012901060105010301060129013a012b012c0102013f0102043f0402073f0102043f0102024001330149014a01290106010501030106013601260127012001210102023f0302013f0102024b0802023f0202034001330149014a0129010601050103010501220123014c0132013301210202014001210202013f0202012e010e014d012e014e0202023f01020340030e0149030e01050103010501190129012a012b012c022102400134013501380102013f012e010e032e0102014b0102013f01020440050e011e020e010301030105012501260127030e02400121014f01350102012e010e022e014e0102014b0102013f01020440070e011e010e01050103010501220123020e011e020e0140012101340102012e020e022e0102014b0102013f01020540090e0104030e0150030e011e010e012102400102012e010e022e0302013f0102012104400121080e01050104070e011e010e012101400102012e010e032e0102023f0202012103400321060e010601050104090e02210102014d010e032e0202021e010201210240032101510152040e020601050103080e012803210102032e0202031e0202024002210128011d014c0153020e01070106010501040103080e0154012801550121013b0502041e0202012101560128011d011f01570129012201190106010501040203070e011b0124011d02580159015a015b0102020e0102021e0102020e0102015c015d011f011b011a010e02060105010403030201050e015e015f0258015201600138015a0102030e0102010e0102030e010201610123011a011901060205010404030501020e0162015e0158011e014c015801600102030e0102030e0102030e030201060105020405030701010e016201630136011b01240202040e0102010e0102030e0102031e020207030801015801050119011a0102021e0102020e0102031e0102010e0202041e020206030901010301050102041e0202051e0102071e010206030a0101030102031e01020b1e0102041e010205030b010102021e02020b1e0202031e01020503";

const smallDuckData = "0x000123270609010d020701070103030402030307020501050102020403020204030802040105010302020301020203010202030a02030104010402020301020203010202030b020201040103020403020204030a020201030104020303040203030a0202010301190201010301190201010301030201040102010401020104010201040102010401020104010201040a02030102020f04090203010202010404020204040203040a02030102020104010202040102020401020204010203040a02040101020e04090201010401010202040202040402020504080201010301010201050102010402020404020202040b02010103010102020501020204030204040102040506020201020108020105010203040102020502020205050202010101010208050502050501020205040202010102020504020c050102010501020105030203010102010501020405040207050102040501020501010101020205030201050b020205020206010201020202010202010509020205010208010801010201050802010501020901090101020105020203030102010501020a01090101020105020202030102010501020b010a01010201050302010501020c010b010102030502020c010c010102030401020c010b01010202040102020401020b010a01010203040102030401020a01090101020204050202040102090108010d02080107010f0207010601120205010601010201040d020304010204010601010201040d020304010204010501010202040d020404010203010501010202040e02030401020301";

const smallColors = ["","ffc446", "000000", "ff0000", "ffffff", "ff8a00"];

const colors = [
    "",
    "8f00ff",
    "000000",
    "8e00ff",
    "8d00ff",
    "8c00ff",
    "8b00ff",
    "8b02ff",
    "8c09ff",
    "8d11ff",
    "8d14ff",
    "8d09ff",
    "8e02ff",
    "fb000b",
    "ff0000",
    "8d16ff",
    "8e09ff",
    "0667f9",
    "b06aff",
    "a14dff",
    "952bff",
    "8c02ff",
    "fc0007",
    "fb0104",
    "fe0001",
    "8b01ff",
    "8b08ff",
    "901eff",
    "9f42fd",
    "b664fa",
    "ffffff",
    "9f42fe",
    "c275f8",
    "c579f7",
    "8b06ff",
    "8f1cff",
    "9f41fe",
    "8c0aff",
    "9732fe",
    "b360fa",
    "c274f8",
    "8c0dff",
    "9a39fe",
    "b969fa",
    "c478f8",
    "f9a3ba",
    "fc809d",
    "c77df8",
    "8f1dff",
    "a247fd",
    "bc6df9",
    "c578f7",
    "c679f7",
    "c981f8",
    "8c0bff",
    "c77df7",
    "ce8dfa",
    "c3d9f9",
    "9a38fe",
    "c67af7",
    "cb86f8",
    "c67ef8",
    "ba69fa",
    "ff8a00",
    "c579f6",
    "c67bf7",
    "c076fa",
    "a44cfd",
    "ca83f8",
    "c376f8",
    "b461fa",
    "9733fe",
    "ca84f8",
    "ba6af9",
    "9a39fd",
    "b50606",
    "a246fd",
    "fc809f",
    "fc809a",
    "c77cf7",
    "8c0cff",
    "c375f8",
    "bc6cf9",
    "9734ff",
    "b563fa",
    "c579f8",
    "c578f8",
    "901fff",
    "dfedff",
    "c77cf8",
    "cb85f9",
    "cf8ffa",
    "bd6df9",
    "b461fb",
    "8c08ff",
    "901cff",
    "c67df9",
    "9733ff",
    "8c01ff",
    "8c06ff"
  ];

  const testDuck = {
      background: "8f00ff",
      body: "0x001c22270c16000800020201010b0006000101030202010a0005000201040202010900040001010203010102020101020301010800040001010303010101030101030301010700030001010303010103030101030303010400020002010403010101030101030301010302020102000100010102020101020301010302010101030201040202010100010104020201050201010702010101000101030201010b020101040201010101020202010b02020103020101",
      head: "0x00071d130a1300020001010b02050001000101060202010502040001010602010108020300010102020201030203010502030001010102010101050106010101020101010601050106010105020101010001000101010601050106010101020101010601050106010105020101010001000101020701020101010201010107010202010602010102010207020101020101010703010602010101000101020702010102010101070301010201080300010201010200010101070201010001010107030106000101070001010207010108001300",
      bill: "0x000e1e200618000400010113000300010101090c000401030003000101020904000101050001010409010102000200080101090400010102090201020901010100010001010809050105090101020901010101020904010c0901010109010101090101010101090101040904010709010104090101010001010209030101090101020a080102090201010002000201020002010109020101060103010b0106010c02010209010103000800010101090106010303060101010a010101090101040008000101010601030206010c0101010a0101010901010500070001010106020302060101010a010101090101060007000101010601030206030101090101070006000101010601030306010102090201070006000101010b0103030602010a0007000101030601010c00080003010d001800",
      hat: "0x0001230c07030001010504010101000101020003010b0002000101090405010b00010001011104030106000101150406000300060402010404010106040200010403000300060403010204030105040200020402000100020102040d0109040101020003010c0002010804010112000201030403000104010013000101020406001300030106001c00",
      decor: "0x00012725010400010d05000503010001030400010301000403010005030500040001030500010303000103010001030400010301000203030002030200010305000400010305000103030001030100020302000203010003030200020302000103050004000103050001030300010302000103020001030200020303000503050004000503010005030200040302000203030002030100010306000400010e0203010f011001000503030002030300040301000203020001030500260026001d0003030100040301001c000703010202031c000803010201031c000a031d00080301001e00060302001f00040303002100020303002600230001030200250001032600260026001d0003030100030302001d00050301000203010005000303140007030100010301000400020301020203130009030100030301000303010201031300080302000703010201031400060303000903150004030400080317000203050008031e0007030300021112000103070002000503020002111b0005000203020001110102010001111900070001031e00080001111d002600",
      colors: [
        "",
        "000000",
        "ffffff",
        "ff0000",
        "0667f9",
        "f9a3ba",
        "fc809d",
        "c3d9f9",
        "8e00ff",
        "ff8a00",
        "b50606",
        "fc809f",
        "fc809a",
        "fb000b",
        "fc0007",
        "fb0104",
        "fe0001",
        "dfedff"
      ]
  }

  export default testDuck;



// ["0x001c22270c16000800020201010b0006000101030202010a0005000201040202010900040001010203010102020101020301010800040001010303010101030101030301010700030001010303010103030101030303010400020002010403010101030101030301010302020102000100010102020101020301010302010101030201040202010100010104020201050201010702010101000101030201010b020101040201010101020202010b02020103020101", "0x00071d130a1300020001010b02050001000101060202010502040001010602010108020300010102020201030203010502030001010102010101050106010101020101010601050106010105020101010001000101010601050106010101020101010601050106010105020101010001000101020701020101010201010107010202010602010102010207020101020101010703010602010101000101020702010102010101070301010201080300010201010200010101070201010001010107030106000101070001010207010108001300", "0x000e1e200618000400010113000300010101090c000401030003000101020904000101050001010409010102000200080101090400010102090201020901010100010001010809050105090101020901010101020904010c0901010109010101090101010101090101040904010709010104090101010001010209030101090101020a080102090201010002000201020002010109020101060103010b0106010c02010209010103000800010101090106010303060101010a010101090101040008000101010601030206010c0101010a0101010901010500070001010106020302060101010a010101090101060007000101010601030206030101090101070006000101010601030306010102090201070006000101010b0103030602010a0007000101030601010c00080003010d001800","0x0001230c07030001010504010101000101020003010b0002000101090405010b00010001011104030106000101150406000300060402010404010106040200010403000300060403010204030105040200020402000100020102040d0109040101020003010c0002010804010112000201030403000104010013000101020406001300030106001c00","0x00012725010400010d05000503010001030400010301000403010005030500040001030500010303000103010001030400010301000203030002030200010305000400010305000103030001030100020302000203010003030200020302000103050004000103050001030300010302000103020001030200020303000503050004000503010005030200040302000203030002030100010306000400010e0203010f011001000503030002030300040301000203020001030500260026001d0003030100040301001c000703010202031c000803010201031c000a031d00080301001e00060302001f00040303002100020303002600230001030200250001032600260026001d0003030100030302001d00050301000203010005000303140007030100010301000400020301020203130009030100030301000303010201031300080302000703010201031400060303000903150004030400080317000203050008031e0007030300021112000103070002000503020002111b0005000203020001110102010001111900070001031e00080001111d002600"]


// ["000000","ffffff","ff0000","0667f9","f9a3ba","fc809d","c3d9f9","8e00ff","ff8a00","b50606","fc809f","fc809a","fb000b","fc0007","fb0104","fe0001","dfedff"]