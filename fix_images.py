import json
import os

IMAGE_MAP = {
    "shahada":              "https://ik.imagekit.io/4zbzbdytp/imgi_21_topic_abrahamic_religions-24Ub5MbtndBYdeZHxSMfyV.webp?updatedAt=1781117902606",
    "salah":                "https://ik.imagekit.io/4zbzbdytp/imgi_11_topic_prayer_salah-AiQHjTprGERKrV6ZWGWS6N.webp?updatedAt=1781117901214",
    "zakat":                "https://ik.imagekit.io/4zbzbdytp/imgi_45_zakat_overview-iB69C239XxvYzdfsgqWaNR.webp?updatedAt=1781117902141",
    "sawm":                 "https://ik.imagekit.io/4zbzbdytp/imgi_40_ramadan_fasting-SeQhGeRR5buiYbtryMhUKA.webp?updatedAt=1781117899738",
    "hajj":                 "https://ik.imagekit.io/4zbzbdytp/hajj_overview-9BS5YUf8qgFKvNgAVo2DpT.webp?updatedAt=1781117901446",
    "tawheed":              "https://ik.imagekit.io/4zbzbdytp/imgi_21_topic_abrahamic_religions-24Ub5MbtndBYdeZHxSMfyV.webp?updatedAt=1781117902606",
    "angels":               "https://ik.imagekit.io/4zbzbdytp/imgi_21_topic_abrahamic_religions-24Ub5MbtndBYdeZHxSMfyV.webp?updatedAt=1781117902606",
    "holy_books":           "https://ik.imagekit.io/4zbzbdytp/imgi_41_ramadan_quran-Q4vPHzY2VWydTXwzmZNchH.webp?updatedAt=1781117900610",
    "prophets":             "https://ik.imagekit.io/4zbzbdytp/imgi_3_prophet_stories_feature-FtRej2zvGTyPa9u6r2MF85.webp?updatedAt=1781117901347",
    "day_of_judgment":      "https://ik.imagekit.io/4zbzbdytp/imgi_24_topic_myths_facts-9XosEGtJZUumCGvLgPN7Zd.webp?updatedAt=1781117901326",
    "wudu":                 "https://ik.imagekit.io/4zbzbdytp/imgi_11_topic_prayer_salah-AiQHjTprGERKrV6ZWGWS6N.webp?updatedAt=1781117901214",
    "islamic_dress":        "https://ik.imagekit.io/4zbzbdytp/imgi_13_topic_islamic_dress-7whwzZgTnmsVkCdmrsGaFv.webp?updatedAt=1781117899286",
    "halal_food":           "https://ik.imagekit.io/4zbzbdytp/imgi_16_topic_halal_haram_food-2MdETNGseNCerrvGkHzkzE.webp?updatedAt=1781117900194",
    "duas":                 "https://ik.imagekit.io/4zbzbdytp/imgi_10_pillar_duas-EqyXdQq6eb7Aov9Lmrvy3T.webp?updatedAt=1781117901995",
    "reading_quran":        "https://ik.imagekit.io/4zbzbdytp/imgi_41_ramadan_quran-Q4vPHzY2VWydTXwzmZNchH.webp?updatedAt=1781117900610",
    "honesty":              "https://ik.imagekit.io/4zbzbdytp/imgi_22_topic_shared_values-KgUz6j3XRCxAXqD4mpnH5G.webp?updatedAt=1781117903378",
    "kindness":             "https://ik.imagekit.io/4zbzbdytp/imgi_46_sadaqah_voluntary-metCJkjaZZWHwc3n86346d.webp?updatedAt=1781117902191",
    "respect":              "https://ik.imagekit.io/4zbzbdytp/imgi_17_topic_respect_elders-6wUPfPgJRqgzEPbLKEPMkD.webp?updatedAt=1781117900196",
    "patience":             "https://ik.imagekit.io/4zbzbdytp/imgi_22_topic_shared_values-KgUz6j3XRCxAXqD4mpnH5G.webp?updatedAt=1781117903378",
    "gratitude":            "https://ik.imagekit.io/4zbzbdytp/imgi_50_hiba_gifts-6i3784QxV2uUz9RuU6ni4m.webp?updatedAt=1781117899322",
    "prophet_muhammad":     "https://ik.imagekit.io/4zbzbdytp/imgi_19_topic_prophet_journey-8ffuT33CJYiTZzo3bCifJ9.webp?updatedAt=1781117900256",
    "prophet_ibrahim":      "https://ik.imagekit.io/4zbzbdytp/imgi_19_topic_prophet_journey-8ffuT33CJYiTZzo3bCifJ9.webp?updatedAt=1781117900256",
    "islamic_civilization": "https://ik.imagekit.io/4zbzbdytp/imgi_20_topic_islamic_civilization-gNpeURs5zuRnR3dMvEndDR.webp?updatedAt=1781117902871",
    "ramadan":              "https://ik.imagekit.io/4zbzbdytp/imgi_39_ramadan_overview-KSNdX85Mzos8r2Xf3JL6rh.webp?updatedAt=1781117901328",
    "eid_al_fitr":          "https://ik.imagekit.io/4zbzbdytp/imgi_42_eid_fitr_celebration-WoRzqkwEMUXtjWTsNNttWJ.webp?updatedAt=1781117904296",
    "eid_al_adha":          "https://ik.imagekit.io/4zbzbdytp/imgi_43_eid_adha_celebration-a8nckcQaGvn3CYJJy7ta5A.webp?updatedAt=1781117903366",
    "al_khwarizmi":         "https://ik.imagekit.io/4zbzbdytp/imgi_25_scholar_al_khwarizmi-YyTnbwqk77BcABwPTm7CYw.webp?updatedAt=1781117901745",
    "ibn_sina":             "https://ik.imagekit.io/4zbzbdytp/imgi_26_scholar_ibn_sina-96S5bSYcoRZXXh4aq6Jx7q.webp?updatedAt=1781117902508",
    "al_razi":              "https://ik.imagekit.io/4zbzbdytp/imgi_27_scholar_al_razi-734zXvqhUQPULCRdzdCjA9.webp?updatedAt=1781117901576",
    "al_biruni":            "https://ik.imagekit.io/4zbzbdytp/imgi_28_scholar_al_biruni-3CxEZkDDXSfMvzUgmWWyDk.webp?updatedAt=1781117901825",
    "al_ghazali":           "https://ik.imagekit.io/4zbzbdytp/imgi_29_scholar_al_ghazali-hXQACXYZ4iArCEGuBdVNNd.webp?updatedAt=1781117901160",
    "fatima_al_fihri":      "https://ik.imagekit.io/4zbzbdytp/imgi_30_scholar_fatima_al_fihri-oUUmqToz9ELRTCtWCXgCQn.webp?updatedAt=1781117901536",
    "ibn_khaldun":          "https://ik.imagekit.io/4zbzbdytp/imgi_31_scholar_ibn_khaldun-22Tqw9TsmYYVf9NDTfPHYp.webp?updatedAt=1781117901557",
}

content_dir = 'src/content'
total = 0
for fname in sorted(os.listdir(content_dir)):
    if not fname.endswith('.json') or fname == 'translations_cache.json':
        continue
    fpath = os.path.join(content_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        topics = json.load(f)
    changes = 0
    for topic in topics:
        tid = topic.get('id', '')
        if tid in IMAGE_MAP:
            old = topic.get('image', '')
            new = IMAGE_MAP[tid]
            if old != new:
                topic['image'] = new
                changes += 1
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=2, ensure_ascii=False)
        f.write('\n')
    total += changes
    print(f"  {fname}: {changes} images updated")
print(f"\nTotal: {total} image URLs updated")
