package kr.co.beauty.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderVO {
	
	private int ordNo;
	private int prodNo;
	private int count;
	private int price;
	private int discount;
	private int disPrice;
	private int point;
	private String color;
	private String size;
	private int total;
	
	//join
	private String prodName;
	private String thumb1;
}
