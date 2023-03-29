/* 
 * 김동근
 * Product1DAO
 */
package kr.co.beauty.vo;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class Product1VO {
	private int prodNo;
	private String prodName;
	private String descript;
	private String prodCate1;
	private String prodCate2;
	private int price;
	private int discount;
	private int disPrice;
	private int point;
	private int stock;
	private int sold;
	private int hit;
	private int score;
	private int review;
	private String thumb1;
	private String thumb2;
	private String thumb3;
	private String thumb4;
	private String thumb5;
	private String thumb6;
	private String detail1;
	private String detail2;
	private String detail3;
	private String company;
	private String status;
	private String origin;
	private String thick;
	private String flex;
	private String through;
	private String lining;
	private String color;
	private String size;
	private String rdate;
	
	//상품등록 추가
	private MultipartFile file1;
	private MultipartFile file2;
	private MultipartFile file3;
	private MultipartFile file4;
	private MultipartFile file5;
	private MultipartFile file6;
	private MultipartFile file7;
	private MultipartFile file8;
	private MultipartFile file9;
	
	//상품목록 카테고리명 수정
	private int cate;
	private String c1Name;
	private int cate2;
	private String c2Name;	
}
