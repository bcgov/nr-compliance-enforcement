import BLKYCSR from "../../../../assets/images/zone-at-a-glance/zones/BLKYCSR.svg";
import CENISL from "../../../../assets/images/zone-at-a-glance/zones/CENISL.svg";
import CENOKNGN from "../../../../assets/images/zone-at-a-glance/zones/CENOKNGN.svg";
import CLMBAKTNY from "../../../../assets/images/zone-at-a-glance/zones/CLMBAKTNY.svg";
import CRBOCHLCTN from "../../../../assets/images/zone-at-a-glance/zones/CRBOCHLCTN.svg";
import CRBOTMPSN from "../../../../assets/images/zone-at-a-glance/zones/CRBOTMPSN.svg";
import EKTNY from "../../../../assets/images/zone-at-a-glance/zones/EKTNY.svg";
import FRSRN from "../../../../assets/images/zone-at-a-glance/zones/FRSRN.svg";
import FRSRS from "../../../../assets/images/zone-at-a-glance/zones/FRSRS.svg";
import NCHKOLKS from "../../../../assets/images/zone-at-a-glance/zones/NCHKOLKS.svg";
import NCST from "../../../../assets/images/zone-at-a-glance/zones/NCST.svg";
import NISL from "../../../../assets/images/zone-at-a-glance/zones/NISL.svg";
import NOKNGN from "../../../../assets/images/zone-at-a-glance/zones/NOKNGN.svg";
import NPCE from "../../../../assets/images/zone-at-a-glance/zones/NPCE.svg";
import OMNCA from "../../../../assets/images/zone-at-a-glance/zones/OMNCA.svg";
import SEA2SKY from "../../../../assets/images/zone-at-a-glance/zones/SEA2SKY.svg";
import SISL from "../../../../assets/images/zone-at-a-glance/zones/SISL.svg";
import SNSHNCST from "../../../../assets/images/zone-at-a-glance/zones/SNSHNCST.svg";
import SOKNGN from "../../../../assets/images/zone-at-a-glance/zones/SOKNGN.svg";
import SPCE from "../../../../assets/images/zone-at-a-glance/zones/SPCE.svg";
import TMPSNNCLA from "../../../../assets/images/zone-at-a-glance/zones/TMPSNNCLA.svg";
import WKTNY from "../../../../assets/images/zone-at-a-glance/zones/WKTNY.svg";

const imageMap = {
  BLKYCSR,
  CENISL,
  CENOKNGN,
  CLMBAKTNY,
  CRBOCHLCTN,
  CRBOTMPSN,
  EKTNY,
  FRSRN,
  FRSRS,
  NCHKOLKS,
  NCST,
  NISL,
  NOKNGN,
  NPCE,
  OMNCA,
  SEA2SKY,
  SISL,
  SNSHNCST,
  SOKNGN,
  SPCE,
  TMPSNNCLA,
  WKTNY,
};

export const getBannerByZone = (key: string) => { 
    return imageMap[key as keyof typeof imageMap];
}