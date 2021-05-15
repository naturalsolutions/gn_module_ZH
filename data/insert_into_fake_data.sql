BEGIN;


INSERT INTO pr_zh.t_river_basin VALUES
(1, 'bassin versant 1', '0103000020E610000001000000110000005B0A48FB1F80044071C971A774824640427C60C77F010540CF656A12BC874640779D0DF9674605400874266DAA884640A54FABE80FAD05405B971AA19F854640315D88D51F61054061360186E581464083BEF4F6E7020540CFD90242EB7D464010CCD1E3F7B60440B39597FC4F7A4640255CC823B8510440A20E2BDCF2774640EC1516DC0F180440E388B5F814764640B7B3AF3C48EF0340C6FD47A643774640C03C64CA87A00340D15CA79196744640077DE9EDCF850340501729948575464083DE1B4300B003409F1D705D31794640B6679604A8E90340594C6C3EAE7B4640A86DC328083E044042CC2555DB7D46409F71E1404876044081CCCEA2778046405B0A48FB1F80044071C971A774824640', 604, 603),
(2, 'bassin versant 2', '0103000020E6100000010000000D000000B2D47ABFD1AE0540C1AA7AF99D86464065A71FD4454A05404DD9E90775894640DA722EC555850540990D32C9C88B4640AA99B514909605405A828C800A914640228AC91B60C60540FF5C34643C9E4640FFB3E6C75F7A06402BF9D85DA09C4640F6B704E09FB206405B25581CCE964640FDDAFAE93F8B0640E222F77475934640F0E0270EA0DF0640BC7669C3618D46408736001B106106409FABADD85F8E4640126BF12900260640359A5C8C818D46409D2CB5DE6FD40540A9143B1A878A4640B2D47ABFD1AE0540C1AA7AF99D864640', 608, 598),
(3, 'bassin versant 3', '0103000020E610000001000000140000005E0F26C5C7C70540060DFD135C9E46402AADBF25009F0540105A0F5F269A4640E86A2BF6979D054097E315889E9646402EABB019E0820540A5164A26A79246406D5512D9077905405303CDE7DC8F4640779D0DF967460540381092054C904640800C1D3BA8240540A583F57F0E8F46403D7E6FD39F1D054031074147AB9046403DF19C2D20340540D34CF73AA9914640D1AE42CA4FAA04402F6EA301BC974640ADF886C2670B0440616BB6F2929B46407923F3C81FCC03404D81CCCEA29B464050E27327D85F0340FF5C34643C9E4640F25F20089001044025CD1FD3DA9E46406552431B804D044064B14D2A1A9F4640E0F42EDE8F5B04405854C4E924A146407FC00303081F0540E9F351465CA44640B39597FC4F5E054040FB912232A246402AADBF25009F05400A100533A6A046405E0F26C5C7C70540060DFD135C9E4640', 607, 599)
;


INSERT INTO pr_zh.t_hydro_area VALUES
(1, 'zone hydro 1', '0103000020E610000001000000090000009C16BCE82B2805408202EFE4D3874640B89388F02F420540CFF6E80DF7854640713D0AD7A3B004401A868F88297F46408EC9E2FE2313044041F4A44C6A7846403B527DE717C5034088F37002D3774640786000E143890440058A58C4B07F464015CAC2D7D79A044061360186E581464045A165DD3FF604400EA14ACD1E8646409C16BCE82B2805408202EFE4D3874640'),
(2, 'zone hydro 2', '0103000020E6100000010000000B000000AD4B8DD0CF7405408B8862F20686464048DC63E9439705405FEE93A300854640757808E3A7510540D4282499D581464059FB3BDBA337054062DBA2CC068146402499D53BDC0E05404E29AF95D07F46408908FF2268EC04403FADA23F347D4640354580D3BB9804407A1C06F3577A4640AB92C83EC83204406FD8B628B37746404AEB6F09C0DF0440A9A5B915C27E464059FB3BDBA3370540D5CA845FEA834640AD4B8DD0CF7405408B8862F206864640'),
(3, 'zone hydro 3', '0103000020E61000000100000005000000F1660DDE576505402BA5677A89914640A1D79FC4E74E0440170FEF39B09C464061545227A0690440FF5C34643C9E4640B56E83DA6F4D0540EBC726F911954640F1660DDE576505402BA5677A89914640'),
(4, 'zone hydro 4', '0103000020E61000000100000006000000AF97A608707A0540CE380D518593464031D0B52FA0770540AAB706B64A984640C58D5BCCCFED04405854C4E924A14640143DF03158B10440E7C589AF76A04640FD87F4DBD7210540C91EA16648994640AF97A608707A0540CE380D5185934640'),
(5, 'zone hydro 5', '0103000020E61000000100000007000000E86A2BF6979D054048179B560A9F464079E92631084C05405854C4E924A146401A51DA1B7C4105404D8237A4519F46400B0BEE073C900540C3D7D7BAD49A464022179CC1DFAF05407ADFF8DA339B46406380441328C205400EDC813AE59D4640E86A2BF6979D054048179B560A9F4640'),
(6, 'zone hydro 6', '0103000020E610000001000000080000009A07B0C8AFDF05400F5F268A909C4640E5B8533A58BF0540EE3F321D3A9146404EF04DD367270640A5164A26A7924640C90567F0F74B06403AC9569753944640C1E270E657730640CEDF844204944640C1559E40D88906400B7DB08C0D97464042CF66D5E76A06409B030473F49A46409A07B0C8AFDF05400F5F268A909C4640'),
(7, 'zone hydro 7', '0103000020E6100000010000000B00000084D4EDEC2BAF0540F9BEB854A58F46402861A6ED5F990540F7031E18408E464089450C3B8CA90540E50E9BC8CC8B464030849CF7FF71054038656EBE11894640A774B0FECFA1054039D0436D1B884640B3D2A414741B06405C3D27BD6F8E46405F984C158C8A06409E7AA4C16D8F4640569C6A2DCCC20640B6813B50A78E46405DBF60376C9B064027124C35B39046402254A9D9036D0640D7DF12807F92464084D4EDEC2BAF0540F9BEB854A58F4640')
;


INSERT INTO pr_zh.t_fct_area VALUES
(1, '0103000020E610000001000000050000009F776341611006406AD95A5F249A464080D591239D010640F29881CAF8994640663046240A0D0640B4ACFBC742984640E54350357A1506406FBDA607059946409F776341611006406AD95A5F249A4640'),
(2, '0103000020E6100000010000000500000031992A18955406406FBDA60705994640E98024ECDB49064044C2F7FE069946405439ED293947064039454772F9974640EF5696E82C5306400E863AAC7097464031992A18955406406FBDA60705994640')
;


INSERT INTO pr_zh.cor_lim_list VALUES
('1a321aa2-2675-4d5a-9bcd-0012042ee74c',579),
('1a321aa2-2675-4d5a-9bcd-0012042ee74c',582),
('1a321aa2-2675-4d5a-9bcd-0012042ee74c',584),
('e30e88e5-1e4a-4cc6-94b8-36c65dafc83a',584),
('e30e88e5-1e4a-4cc6-94b8-36c65dafc83a',585)
;


INSERT INTO pr_zh.t_zh(code, main_name, create_author, update_author, geom, id_lim_list, remark_lim, id_sdage, total_hab_cover, id_thread, id_diag_hydro, id_diag_bio) VALUES
(
    'XXXX-XX-XXXX', 
    'zone humide 1',
    1,
    1,
     '0103000020E61000000100000005000000C102983270200540B2F1608BDD864640EEB43522188705401475E61E12844640B56E83DA6F4D05406667D13B1582464006F7031E18000540520FD1E80E864640C102983270200540B2F1608BDD864640',
    '1a321aa2-2675-4d5a-9bcd-0012042ee74c',
    'ma remarque lim',
    944,
    10,
    700,
    747,
    752
),
(
    'XXXX-XX-XXX2', 
    'zone humide 2',
    1,
    1,
    '0103000020E610000001000000050000009450FA42C8B90440AB4203B16C8246402F6EA301BCC50440034015376E814640F44E05DCF39C04400EDAAB8F8780464077871403249A04401897AAB4C58146409450FA42C8B90440AB4203B16C824640',
    'e30e88e5-1e4a-4cc6-94b8-36c65dafc83a',
    'ma remarque lim sur zh2',
    945,
    15,
    701,
    748,
    751
)
;


COMMIT;





--'zone humide 2' : '0103000020E610000001000000050000009450FA42C8B90440AB4203B16C8246402F6EA301BCC50440034015376E814640F44E05DCF39C04400EDAAB8F8780464077871403249A04401897AAB4C58146409450FA42C8B90440AB4203B16C824640'
--'zone humide 3' : '0103000020E61000000100000007000000FA62EFC5172D0540350A4966F5A046404EF04DD3672706402444F982169A464081ECF5EE8F770640E8C072840C90464004FEF0F3DF630640601E32E5438C4640757808E3A75105400ABDFE243E8F46402237C30DF85C0440574277499C974640FA62EFC5172D0540350A4966F5A04640'
--'zone humide 4' : '0103000020E61000000100000005000000992EC4EA8FF005409B030473F49A4640992EC4EA8FF005405B25581CCE96464042CF66D5E76A06401F679AB0FD96464081ECF5EE8F770640FC6F253B369A4640992EC4EA8FF005409B030473F49A4640'


