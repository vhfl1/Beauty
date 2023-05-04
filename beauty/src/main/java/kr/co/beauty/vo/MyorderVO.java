package kr.co.beauty.vo;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MyorderVO {
	private int ordNo;
	private int prodNo;
	private String prodName;
	private String thumb1;
	private String company;
	private int price;
	private int disPrice;
	private int count;
	private String color;
	private String size;
	private String rdate;
	private int ordComplete;
	
	public String getRdate() {
		return rdate.substring(2,10);
	}
	
	public int getSalePrice() {
		return (price-disPrice);
	}
	
	public int getTotalPrice() {
		return (getSalePrice()*count);
	}
}
