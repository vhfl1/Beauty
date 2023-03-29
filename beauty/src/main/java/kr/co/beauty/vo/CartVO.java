package kr.co.beauty.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CartVO {
	private int cartNo;
	private String uid;
	private int prodNo;
	private int count;
	private String color;
	private String size;
	private String rdate;

	//add
	private String prodName;
	private int price;
	private int discount;
	private int disPrice;
	private int point;
	private String thumb1;
	
	public int getSalePrice() {
		return (price-disPrice);
	}
	
	public int getTotalPrice() {
		return (getSalePrice()*count);
	}
}
