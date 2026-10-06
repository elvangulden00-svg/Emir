// lib/ornekBelgeler.ts

export interface BelgeSeti {
  id: string;
  baslik: string;
  donem: string;
  aciklama: string;
  belgeler: Array<{
    etiket: string;
    baslik: string;
    kaynak: string;
    metin: string;
  }>;
  ornekSorular: string[];
}

export const ORNEK_BELGE_SETLERI: BelgeSeti[] = [
  {
    id: "amasya-genelgesi-1919",
    baslik: "Amasya Genelgesi ve İstanbul'un Tepkisi (Haziran 1919)",
    donem: "21-22 Haziran 1919",
    aciklama:
      "Millî Mücadele'nin amaç, gerekçe ve yöntemini belirleyen tarihi genelge ve Dahiliye Nezareti'nin buna mukabil genelgesi.",
    belgeler: [
      {
        etiket: "Belge 1",
        baslik: "Amasya Tamimi Maddeleri (22 Haziran 1919)",
        kaynak: "Nutuk, Cilt I / Askerî Tarih Belgeleri Dergisi",
        metin: `1. Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir.
2. İstanbul Hükûmeti, üzerine aldığı sorumluluğun gereklerini yerine getirememektedir. Bu durum milletimizi yok olmuş gibi tanıtmaktadır.
3. Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır.
4. Milletin haklarını dünyaya duyurmak için her türlü tesir ve denetimden uzak millî bir heyetin varlığı zaruridir.
5. Anadolu'nun her bakımdan en güvenli yeri olan Sivas'ta millî bir kongrenin acele toplanması kararlaştırılmıştır. Her livadan üç delege derhal hareket etmelidir.`,
      },
      {
        etiket: "Belge 2",
        baslik: "Dahiliye Nazırı Ali Kemal'in Mustafa Kemal Paşa Hakkındaki Genelgesi (23 Haziran 1919)",
        kaynak: "Başbakanlık Osmanlı Arşivi, Dahiliye Şifre Kalemi",
        metin: `Mustafa Kemal Paşa büyük bir asker olmakla beraber günümüzün siyasetini kavrayamamıştır. Kendisine verilen görev sınırını aşarak orduyu siyasete karıştırmış, memurlar ve ahaliden telgraflar çektirerek millî ordu kurulması fikrini yaymıştır. Bu sebeple memuriyeti lağvedilmiş ve azledilmiştir. Kendisiyle hiçbir resmî muameleye girişilmemesi ve vilayet emirlerinin doğrudan Dahiliye Nezareti'nden alınması kesinlikle emrolunur.`,
      },
      {
        etiket: "Belge 3",
        baslik: "15. Kolordu Komutanı Kâzım Karabekir Paşa'nın Mustafa Kemal Paşa'ya Telgrafı (24 Haziran 1919)",
        kaynak: "İstiklal Harbimiz, Kâzım Karabekir",
        metin: `Amasya'dan tebliğ buyrulan mukaddes kararları bütünüyle aldım. Vatan ve milletin selametine dair tespitleriniz harfi harfine doğrudur. 15. Kolordu'nun bütün tümen ve zabitanı, millî gaye uğrunda zatıâlinizin emirlerini beklemektedir. Erzurum Kongresi'nin toplanması için hazırlıklar tamamlanmak üzeredir.`,
      },
    ],
    ornekSorular: [
      "Amasya Genelgesi'ne göre milletin bağımsızlığını kim ve nasıl kurtaracaktır?",
      "Dahiliye Nazırı Ali Kemal, Mustafa Kemal Paşa'nın görevden alınmasına hangi gerekçeyi göstermiştir?",
      "Kâzım Karabekir Paşa'nın telgrafında Amasya kararlarına yönelik tutumu nasıldır?",
      "Mustafa Kemal Paşa bu belgelerde yabancı devletlerle bir barış antlaşması imzalamış mıdır?",
    ],
  },
  {
    id: "sivas-kongresi-1919",
    baslik: "Sivas Kongresi Kararları ve Manda Meselesi (Eylül 1919)",
    donem: "4-11 Eylül 1919",
    aciklama:
      "Tüm cemiyetlerin Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti altında birleşmesi ve manda tartışmaları.",
    belgeler: [
      {
        etiket: "Belge 1",
        baslik: "Sivas Kongresi Beyannamesi (11 Eylül 1919)",
        kaynak: "İrâde-i Milliye Gazetesi, Sayı 1",
        metin: `Madde 1: Osmanlı mülkünün 30 Teşrinievvel 1918 tarihindeki sınırları dahilinde bulunan vatan parçaları bir bütündür, birbirinden ayrılamaz.
Madde 3: Kuvâ-yı Milliyeyi amil, irâde-i milliyeyi hâkim kılmak esastır.
Madde 4: Hristiyan unsurlara siyasî hâkimiyet ve içtimaî dengemizi bozacak imtiyazlar verilemez.
Madde 7: Manda ve himaye kabul olunamaz. Devletimizin iç ve dış istiklali bütünüyle korunacaktır.
Madde 9: Bütün millî cemiyetler Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti unvanı altında birleştirilmiştir.`,
      },
      {
        etiket: "Belge 2",
        baslik: "Sivas Kongresi Zabıtları: Manda Müzakeresi (8-9 Eylül 1919)",
        kaynak: "Sivas Kongresi Tutanakları",
        metin: `İsmail Hami Bey ve bazı delegeler, memleketin mali ve iktisadi vaziyetinin zayıflığını öne sürerek Amerikan mandasının geçici olarak incelenmesini teklif etmişlerdir. Tıbbiyeli Hikmet (Boran) kürsüye gelerek: "Paşam, murahhası bulunduğum tıbbiyeliler beni buraya istiklal davamızı başarmak için gönderdiler, mandayı kabul edemem. Eğer kabul ederseniz sizi de reddederiz!" demiştir. Mustafa Kemal Paşa ise: "Evlat müsterih ol, parola tektir: Ya istiklal ya ölüm!" cevabını vermiştir.`,
      },
      {
        etiket: "Belge 3",
        baslik: "Elazığ Valisi Ali Galip'e Gönderilen Gizli İstanbul Talimatı (Eylül 1919)",
        kaynak: "Atatürk Araştırma Merkezi Arşivi",
        metin: `Damat Ferit Paşa Kabinesi'nden Ali Galip Bey'e: Sivas'ta toplanmakta olan kongre kanun dışı ve asidir. Derhal aşiret süvarileri tertip edilerek Sivas basılmalı, kongre dağıtılmalı ve Mustafa Kemal ile arkadaşları tevkif edilerek Dersaadet'e (İstanbul'a) teslim edilmelidir.`,
      },
    ],
    ornekSorular: [
      "Sivas Kongresi Beyannamesi'nde manda ve himaye konusunda ne karar alınmıştır?",
      "Tıbbiyeli Hikmet Bey kürsüde hangi net tavrı koymuştur?",
      "Ali Galip Bey'e verilen gizli talimatta kongreye yönelik ne yapılması istenmiştir?",
      "Belgelerde Fransız ordusuyla imzalanmış bir ateşkes maddesi var mıdır?",
    ],
  },
  {
    id: "mondros-ve-mitingler-1919",
    baslik: "Mondros Mütarekesi ve Sultanahmet Mitingi (1918-1919)",
    donem: "Kasım 1918 - Mayıs 1919",
    aciklama:
      "Ağır mütareke şartları, işgaller ve milletin mitinglerle yükselen ilk gür sesi.",
    belgeler: [
      {
        etiket: "Belge 1",
        baslik: "Mondros Ateşkes Antlaşması'nın Kritik Maddeleri (30 Ekim 1918)",
        kaynak: "Düstur, 3. Tertip",
        metin: `Madde 7: İtilaf Devletleri, emniyetlerini tehdit edecek bir durum ortaya çıkarsa herhangi bir stratejik noktayı işgal etme hakkına sahip olacaktır.
Madde 24: Vilâyât-ı Sitte'de (Altı Doğu Vilayeti) bir karışıklık çıkarsa, İtilaf Devletleri bu vilayetlerin herhangi bir kısmını işgal hakkını muhafaza eder.
Madde 5: Sınırların korunması ve iç asayişin temini için gereken askeri birlikler dışındaki Osmanlı ordusu derhal terhis edilecektir.`,
      },
      {
        etiket: "Belge 2",
        baslik: "Halide Edib'in Sultanahmet Mitingi Konuşması (23 Mayıs 1919)",
        kaynak: "Vakit Gazetesi, 24 Mayıs 1919",
        metin: `Milletler dostumuz, hükümetler düşmanımızdır. Türk milleti hak ve adalet gününün geleceğine inanır. Yedi yüz yıllık tarihinin asil şehitlerine yemin ederiz ki, hürriyet ve bağımsızlığımızdan zerre kadar vazgeçmeyeceğiz. Kalbimizdeki iman ve azim hiçbir topla, hiçbir süngüyle söndürülemez.`,
      },
      {
        etiket: "Belge 3",
        baslik: "Harbiye Nezareti'nin Ordu Birliklerine İşgaller Hakkındaki Genelgesi (Mayıs 1919)",
        kaynak: "Harp Tarihi Vesikaları Dergisi",
        metin: `İzmir ve civarının İtilaf donanması himayesindeki Yunan birliklerince işgali mütareke şartları gereğidir. Askeri makamlar ve sivil idareciler kesinlikle mukavemet göstermeyecek, sükûneti muhafaza edecek ve asayişin bozulmasına sebep olabilecek gösterilere mani olacaktır.`,
      },
    ],
    ornekSorular: [
      "Mondros Mütarekesi'nin 7. maddesi İtilaf Devletleri'ne hangi hakkı tanımaktadır?",
      "Halide Edib Sultanahmet Mitingi'nde milletin hangi kararlılığını dile getirmiştir?",
      "Harbiye Nezareti işgallere karşı ordudan nasıl davranmasını istemiştir?",
      "Bu belgelerde TBMM'nin açılış tarihi yazmakta mıdır?",
    ],
  },
];

export function belgeSetiniMetneCevir(set: BelgeSeti): string {
  return set.belgeler
    .map(
      (b) =>
        `${b.etiket}: ${b.baslik}\nKaynak: ${b.kaynak}\n${b.metin}`
    )
    .join("\n\n---\n\n");
}
